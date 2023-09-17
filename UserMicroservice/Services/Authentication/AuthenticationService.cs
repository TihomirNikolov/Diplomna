using Azure.Core;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.IdentityModel.Tokens.Jwt;
using UAParser;
using UserMicroservice.Enums;
using UserMicroservice.Helpers;
using UserMicroservice.Interfaces.Helpers;
using UserMicroservice.Interfaces.Services;
using UserMicroservice.Interfaces.Services.Authentication;
using UserMicroservice.Models;
using UserMicroservice.Models.Database;
using UserMicroservice.Models.Responses;

namespace UserMicroservice.Services.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        #region Declarations

        private readonly IAuthenticationHelper _authHelper;
        private readonly IHangfireHelper _hangfireHelper;

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _dbContext;

        private readonly IEmailService _emailService;

        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        #endregion

        #region Constructors

        public AuthenticationService(IAuthenticationHelper authHelper,
                                     IHangfireHelper hangfireHelper,
                                     UserManager<ApplicationUser> userManager,
                                     SignInManager<ApplicationUser> signInManager,
                                     ApplicationDbContext dbContext,
                                     IEmailService emailService,
                                     IConfiguration configuration,
                                     IHttpContextAccessor httpContextAccessor)
        {
            _authHelper = authHelper;
            _hangfireHelper = hangfireHelper;
            _userManager = userManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
            _emailService = emailService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        #endregion

        #region Methods

        public async Task<Response<LoginResponse>> LoginAsync(string email, string password)
        {
            var user = await _userManager.Users.Include(u => u.RefreshTokens).FirstOrDefaultAsync(u => email.ToLower() == u.Email.ToLower());
            if (user == null)
            {
                return new Response<LoginResponse> { Status = StatusEnum.Failure, Message = "User not found" };
            }

            if (!user.IsActive)
                return new Response<LoginResponse> { Status = StatusEnum.Failure, Message = "User is not active" };

            var result = await _signInManager.PasswordSignInAsync(user, password, false, true);
            if (!result.Succeeded)
            {
                if (result.IsLockedOut)
                {
                    return new Response<LoginResponse> { Status = StatusEnum.Forbid, Message = "User is locked out" };
                }
                return new Response<LoginResponse> { Status = StatusEnum.Failure, Message = "User not found" };
            }

            var authClaims = await _authHelper.GetClaims(user);

            var token = _authHelper.CreateToken(authClaims);
            var refreshToken = _authHelper.GenerateToken();

            _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

            user.RefreshTokens ??= new List<RefreshToken>();

            if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null)
                return new Response<LoginResponse> { Status = StatusEnum.InternalError, Message = "Cannot access HttpContext" };

            var userAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"];
            var uaParser = Parser.GetDefault();
            ClientInfo clientInfo = uaParser.Parse(userAgent);

            user.RefreshTokens.Add(new RefreshToken()
            {
                Token = refreshToken,
                TokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays),
                CreatedTime = DateTime.Now,
                DeviceType = clientInfo.UA.Family + " " + clientInfo.UA.Major + "." + clientInfo.UA.Minor,
            });

            await _userManager.UpdateAsync(user);

            var isEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user);
            var roles = (await _userManager.GetRolesAsync(user)).ToList();

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            return new Response<LoginResponse>
            {
                Status = StatusEnum.Success,
                Data = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    Roles = roles,
                    IsEmailConfirmed = isEmailConfirmed
                }
            };
        }

        public async Task<Response> RegisterAsync(string email, string password, string firstName, string lastName)
        {
            var userExists = await _userManager.FindByEmailAsync(email);
            if (userExists != null)
                return new Response { Status = StatusEnum.Conflict, Message = "Conflict" };

            ApplicationUser user = new()
            {
                Email = email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = email,
                UserInfo = new UserInfo
                {
                    FirstName = firstName,
                    LastName = lastName,
                },
                LockoutEnabled = true,
                IsActive = true
            };

            var emailVerificationToken = _authHelper.GenerateToken();

            user.EmailVerificationToken = new EmailVerificationToken()
            {
                Token = emailVerificationToken,
                TokenExpiryTime = DateTime.Now.AddDays(1),
                CreatedTime = DateTime.Now,
            };

            if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null)
                return new Response { Status = StatusEnum.InternalError, Message = "Cannot access HttpContext" };


            var clientDomain = _httpContextAccessor.HttpContext.Request.Headers["Origin"].ToString();

            var confirmEmailLink = clientDomain + "/email/verify/" + emailVerificationToken;

            if (!_emailService.SendConfirmEmail(email, confirmEmailLink))
                return new Response { Status = StatusEnum.InternalError, Message = "Email could not be sent" };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                return new Response { Status = StatusEnum.InternalError, Message = "Internal error" };

            await _userManager.AddToRoleAsync(user, "User");

            BackgroundJob.Schedule<IHangfireService>(service => service.DeleteEmailVerification(emailVerificationToken), TimeSpan.FromHours(24));


            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response> ResetPasswordAsync(string resetToken, string password)
        {
            var user = await _dbContext.Users.Include(u => u.ResetPasswordToken).FirstOrDefaultAsync(u => u.ResetPasswordToken.Token == resetToken);

            if (user == null)
                return new Response { Status = StatusEnum.NotFound, Message = "User not found" };
            try
            {
                await _userManager.RemovePasswordAsync(user);
                await _userManager.AddPasswordAsync(user, password);

                var resetPasswordToken = await _dbContext.ResetPasswordTokens.FirstOrDefaultAsync(r => r.Token == resetToken);

                if (resetPasswordToken == null)
                    return new Response { Status = StatusEnum.NotFound, Message = "Reset password token not found" };

                _dbContext.Remove(resetPasswordToken);
                await _dbContext.SaveChangesAsync();

                _hangfireHelper.DeleteJobByArgument(resetToken);

                return new Response { Status = StatusEnum.Success };
            }
            catch
            {
                return new Response { Status = StatusEnum.InternalError, Message = "Internal error" };
            }
        }

        public async Task<Response> LogoutAsync(string email, string accessToken, string refreshToken)
        {
            var refreshTokens = _dbContext.RefreshTokens.Include(t => t.User).ToList();

            var tokensToDelete = refreshTokens.Where(t => t.User.Email!.ToLower() == email.ToLower() && t.Token == refreshToken);

            _dbContext.RefreshTokens.RemoveRange(tokensToDelete);
            await _dbContext.SaveChangesAsync();

            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response<LoginResponse>> IsLoggedAsync(string accessToken, string refreshToken)
        {
            var refreshTokenObject = await _dbContext.RefreshTokens.Include(u => u.User).FirstOrDefaultAsync(r => r.Token == refreshToken);

            if (refreshTokenObject == null || refreshTokenObject.User == null)
                return new Response<LoginResponse> { Status = StatusEnum.NotFound, Message = "Refresh token or user not found" };

            var isEmailConfirmed = await _userManager.IsEmailConfirmedAsync(refreshTokenObject.User);

            return new Response<LoginResponse>
            {
                Status = StatusEnum.Success,
                Data = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    IsEmailConfirmed = isEmailConfirmed
                }
            };
        }
        #endregion
    }
}
