using Azure.Core;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using UAParser;
using UserMicroservice.Enums;
using UserMicroservice.Interfaces.Helpers;
using UserMicroservice.Interfaces.Services;
using UserMicroservice.Interfaces.Services.Authentication;
using UserMicroservice.Interfaces.Services.Database;
using UserMicroservice.Models;
using UserMicroservice.Models.Database;
using UserMicroservice.Models.Responses;

namespace UserMicroservice.Services.Authentication
{
    public class TokenService : ITokenService
    {
        #region Declarations

        private readonly IAuthenticationHelper _authHelper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;

        private readonly IEmailService _emailService;

        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        #endregion

        #region Constructors

        public TokenService(IAuthenticationHelper authHelper,
                            UserManager<ApplicationUser> userManager,
                            ApplicationDbContext dbContext,
                            IEmailService emailService,
                            IConfiguration configuration,
                            IHttpContextAccessor httpContextAccessor)
        {
            _authHelper = authHelper;
            _userManager = userManager;
            _dbContext = dbContext;
            _emailService = emailService;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        #endregion

        #region Methods

        public async Task<Response<TokenResponse>> RefreshTokenAsync(string email, string oldRefreshToken, string oldAccessToken)
        {
            var user = await _userManager.Users.Include(u => u.RefreshTokens).FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

            if (user == null || user.RefreshTokens.FirstOrDefault(t => t.Token == oldRefreshToken && t.TokenExpiryTime >= DateTime.Now) == null)
            {
                return new Response<TokenResponse> { Status = StatusEnum.Failure, Message = "Invalid access token or refresh token" };
            }

            var authClaims = await _authHelper.GetClaims(user);

            var newAccessToken = _authHelper.CreateToken(authClaims);
            var newRefreshToken = _authHelper.GenerateToken();

            _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

            if (_httpContextAccessor == null)
                return new Response<TokenResponse> { Status = StatusEnum.InternalError, Message = "Cannot access HttpContext" };

            if (_httpContextAccessor == null)
                return new Response<TokenResponse> { Status = StatusEnum.InternalError, Message = "Cannot access HttpContext" };

            var userAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"];
            var uaParser = Parser.GetDefault();
            ClientInfo clientInfo = uaParser.Parse(userAgent);

            var rToken = user.RefreshTokens.FirstOrDefault(t => t.Token == oldRefreshToken);

            if (rToken != null)
            {
                rToken.Token = newRefreshToken;
                rToken.TokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);
                rToken.DeviceType = clientInfo.UA.Family + " " + clientInfo.UA.Major + "." + clientInfo.UA.Minor;
            }

            _dbContext.Users.Update(user);
            await _userManager.UpdateAsync(user);

            var newAccesTokenString = new JwtSecurityTokenHandler().WriteToken(newAccessToken);

            return new Response<TokenResponse>
            {
                Status = StatusEnum.Success,
                Data = new TokenResponse
                {
                    AccessToken = newAccesTokenString,
                    RefreshToken = newRefreshToken
                }
            };
        }
        public async Task<Response> GenerateResetPasswordTokenAsync(string email)
        {
            var user = await _dbContext.Users.Include(u => u.ResetPasswordToken).FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

            if (user == null)
                return new Response { Status = StatusEnum.NotFound, Message = "User not found" };

            if (user.ResetPasswordToken == null)
                return new Response { Status = StatusEnum.NotFound, Message = "Reset pasasword token not found" };

            _dbContext.ResetPasswordTokens.Remove(user.ResetPasswordToken);
            await _dbContext.SaveChangesAsync();

            var resetPasswordToken = _authHelper.GenerateToken();

            user.ResetPasswordToken = new ResetPasswordToken()
            {
                Token = resetPasswordToken,
                TokenExpiryTime = DateTime.Now.AddMinutes(60),
                CreatedTime = DateTime.Now,
            };

            if (_httpContextAccessor.HttpContext == null)
            {
                return new Response<bool> { Status = StatusEnum.InternalError, Message = "Cannot access HttpContext" };
            }

            var clientDomain = _httpContextAccessor.HttpContext.Request.Headers["Origin"].ToString();
            var resetPasswordLink = clientDomain + "/password/reset/" + resetPasswordToken;

            if (!_emailService.SendPasswordResetEmail(email, resetPasswordLink))
                return new Response { Status = StatusEnum.InternalError, Message = "Email could not be sent" };

            await _userManager.UpdateAsync(user);

            BackgroundJob.Schedule<IUsersService>(service => service.DeletePasswordVerification(resetPasswordToken), TimeSpan.FromMinutes(5));

            return new Response { Status = StatusEnum.Success };

        }

        public async Task<Response> VerifyPasswordTokenAsync(string token)
        {
            var resetPasswordToken = await _dbContext.ResetPasswordTokens.FirstOrDefaultAsync(t => t.Token == token);

            if (resetPasswordToken == null)
                return new Response { Status = StatusEnum.NotFound, Message = "Token not found" };

            return new Response { Status = StatusEnum.Success };
        }

        #endregion
    }
}
