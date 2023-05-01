using AuthMicroservice.Authentication.Helpers;
using AuthMicroservice.Authentication.Models.Database;
using AuthMicroservice.Authentication.Models.Requests;
using AuthMicroservice.Authentication.Models.Responses;
using AuthMicroservice.Database;
using AuthMicroservice.Interfaces.Services;
using AuthMicroservice.Interfaces.Services.Database;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using UAParser;

namespace AuthMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        #region Declarations 

        private readonly AuthenticationHelper _authHelper;
        private readonly HangfireHelper _hangfireHelper;

        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly IEmailService _emailService;

        private readonly IConfiguration _configuration;

        #endregion

        #region Constructor

        public AuthenticateController(UserManager<ApplicationUser> userManager,
                                      IConfiguration configuration,
                                      AuthenticationHelper authHelper,
                                      ApplicationDbContext context,
                                      IEmailService emailService,
                                      HangfireHelper hangfireHelper)
        {
            _userManager = userManager;
            _configuration = configuration;
            _authHelper = authHelper;
            _context = context;
            _emailService = emailService;
            _hangfireHelper = hangfireHelper;
        }

        #endregion

        #region Methods

        #region Get Methods

        [HttpGet]
        [Route("verify-password-token/{token}")]
        public async Task<IActionResult> VerifyPasswordToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(false);
            }

            var resetPasswordToken = await _context.ResetPasswordTokens.FirstOrDefaultAsync(t => t.Token == token);

            if (resetPasswordToken != null)
            {
                return Ok(true);
            }
            else
            {
                return NotFound(false);
            }
        }

        #endregion

        #region Post Methods

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            if (model != null)
            {
                var user = await _userManager.Users.Include(u => u.RefreshTokens).SingleAsync(u => model.Email.ToLower() == u.Email.ToLower());
                if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    var authClaims = await _authHelper.GetClaims(user);

                    var token = _authHelper.CreateToken(authClaims);
                    var refreshToken = _authHelper.GenerateToken();

                    _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

                    if (user.RefreshTokens == null)
                    {
                        user.RefreshTokens = new List<RefreshToken>();
                    }

                    var userAgent = Request.Headers["User-Agent"];
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

                    var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

                    return Ok(new TokenResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        IsEmailConfirmed = isEmailConfirmed
                    });
                }
                return NotFound();
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            if (model != null)
            {
                var userExists = await _userManager.FindByEmailAsync(model.Email);
                if (userExists != null)
                    return Conflict();

                ApplicationUser user = new()
                {
                    Email = model.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = model.Email
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return StatusCode(StatusCodes.Status500InternalServerError);

                var emailVerificationToken = _authHelper.GenerateToken();

                user.EmailVerificationToken = new EmailVerificationToken()
                {
                    Token = emailVerificationToken,
                    TokenExpiryTime = DateTime.Now.AddDays(1),
                    CreatedTime = DateTime.Now,
                };

                var clientDomain = Request.Headers["Origin"].ToString();

                var confirmEmailLink = clientDomain + "/email/verify/" + emailVerificationToken;

                if (_emailService.SendConfirmEmail(model.Email, confirmEmailLink))
                {
                    await _userManager.UpdateAsync(user);

                    BackgroundJob.Schedule<IUsersService>(service => service.DeleteEmailVerification(emailVerificationToken), TimeSpan.FromHours(24));
                    return Ok();
                }
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest tokenModel)
        {
            if (tokenModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string? refreshToken = tokenModel.RefreshToken;

            var user = await _userManager.Users.Include(u => u.RefreshTokens.Where(r => r.Token == refreshToken)).SingleAsync();

            if (user == null || user.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken && t.TokenExpiryTime >= DateTime.Now) == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            var authClaims = await _authHelper.GetClaims(user);

            var newAccessToken = _authHelper.CreateToken(authClaims);
            var newRefreshToken = _authHelper.GenerateToken();

            _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

            var userAgent = Request.Headers["User-Agent"];
            var uaParser = Parser.GetDefault();
            ClientInfo clientInfo = uaParser.Parse(userAgent);

            user.RefreshTokens.Add(new RefreshToken()
            {
                Token = newRefreshToken,
                TokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays),
                CreatedTime = DateTime.Now,
                DeviceType = clientInfo.UA.Family + " " + clientInfo.UA.Major + "." + clientInfo.UA.Minor,
            });

            _context.RefreshTokens.Remove(user.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken));
            await _userManager.UpdateAsync(user);

            var isEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user);

            return Ok(new TokenResponse()
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                RefreshToken = newRefreshToken,
                IsEmailConfirmed = isEmailConfirmed
            });
        }

        [HttpPost]
        [Route("reset-password-token")]
        public async Task<IActionResult> GenerateResetPasswordToken([FromBody] GenerateResetPasswordTokenRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest();
            }

            var user = await _context.Users.Include(u => u.ResetPasswordToken).FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user != null)
            {
                if (user.ResetPasswordToken != null)
                {
                    _context.ResetPasswordTokens.Remove(user.ResetPasswordToken);
                    await _context.SaveChangesAsync();
                }
                var resetPasswordToken = _authHelper.GenerateToken();

                user.ResetPasswordToken = new ResetPasswordToken()
                {
                    Token = resetPasswordToken,
                    TokenExpiryTime = DateTime.Now.AddMinutes(60),
                    CreatedTime = DateTime.Now,
                };

                var clientDomain = Request.Headers["Origin"].ToString();

                var resetPasswordLink = clientDomain + "/password/reset/" + resetPasswordToken;

                if (_emailService.SendPasswordResetEmail(request.Email, resetPasswordLink))
                {
                    await _userManager.UpdateAsync(user);

                    BackgroundJob.Schedule<IUsersService>(service => service.DeletePasswordVerification(resetPasswordToken), TimeSpan.FromMinutes(5));
                    return Ok();
                }
            }

            return NotFound();
        }


        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.ResetToken))
            {
                return BadRequest();
            }

            var user = await _context.Users.Include(u => u.ResetPasswordToken).FirstOrDefaultAsync(u => u.ResetPasswordToken.Token == request.ResetToken);

            if (user != null)
            {
                try
                {
                    await _userManager.RemovePasswordAsync(user);
                    await _userManager.AddPasswordAsync(user, request.Password);

                    var resetPasswordToken = await _context.ResetPasswordTokens.FirstOrDefaultAsync(r => r.Token == request.ResetToken);

                    _context.Remove(resetPasswordToken);
                    await _context.SaveChangesAsync();

                    _hangfireHelper.DeleteJobByArgument(request.ResetToken);

                    return Ok();
                }
                catch
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

            return NotFound();
        }

        #endregion

        #region Delete Methods

        [Authorize]
        [HttpDelete]
        [Route("logout")]
        public async Task<IActionResult> Logout([FromHeader] string authorization)
        {
            if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
            {
                var accessToken = headerValue.Parameter;

                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token or refresh token");
                }

                string email = principal.Identity.Name;

                var refreshToken = Request.Headers["RefreshToken"].ToString();

                if (string.IsNullOrEmpty(refreshToken))
                {
                    return BadRequest("Refresh Token missing.");
                }

                var refreshTokens = _context.RefreshTokens.Include(t => t.User).ToList();

                var tokensToDelete = refreshTokens.Where(t => t.User.Email.ToLower() == email.ToLower() && t.Token == refreshToken);

                _context.RefreshTokens.RemoveRange(tokensToDelete);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        #endregion

        #endregion
    }
}
