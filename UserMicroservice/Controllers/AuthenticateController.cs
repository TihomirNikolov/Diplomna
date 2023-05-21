using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using UAParser;
using UserMicroservice.Extensions;
using UserMicroservice.Helpers;
using UserMicroservice.Helpers.Constants;
using UserMicroservice.Interfaces.Services;
using UserMicroservice.Interfaces.Services.Database;
using UserMicroservice.Models;
using UserMicroservice.Models.Database;
using UserMicroservice.Models.Requests;
using UserMicroservice.Models.Responses;

namespace UserMicroservice.Controllers
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

        [Authorize]
        [HttpGet]
        [Route("is-logged")]
        public async Task<IActionResult> IsLogged()
        {
            var accessToken = Request.GetAuthorizationToken();

            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is missing.");
            }

            var refreshToken = Request.GetRefreshToken();

            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("Refresh token is missing .");
            }

            var refreshTokenObject = await _context.RefreshTokens.Include(u => u.User).FirstOrDefaultAsync(r => r.Token == refreshToken);

            if (refreshTokenObject != null && refreshTokenObject.User != null)
            {
                var isEmailConfirmed = await _userManager.IsEmailConfirmedAsync(refreshTokenObject.User);

                return Ok(new LoginResponse()
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    IsEmailConfirmed = isEmailConfirmed

                });
            }

            return NotFound();
        }

        #endregion

        #region Post Methods

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            if (model != null)
            {
                var user = await _userManager.Users.Include(u => u.RefreshTokens).FirstOrDefaultAsync(u => model.Email.ToLower() == u.Email.ToLower());
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
                    var roles = (await _userManager.GetRolesAsync(user)).ToList();

                    var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

                    if (model.RememberMe)
                    {
                        Response.Cookies.AppendDefaultCookie(CookieConstants.AccessToken, accessToken);
                        Response.Cookies.AppendDefaultCookie(CookieConstants.RefreshToken, refreshToken);
                    }
                    else
                    {
                        Response.Cookies.AppendDefaultCookie(CookieConstants.AccessToken, accessToken, 1);
                        Response.Cookies.AppendDefaultCookie(CookieConstants.RefreshToken, refreshToken, 1);
                    }

                    return Ok(new LoginResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        IsEmailConfirmed = isEmailConfirmed,
                        Roles = roles
                    });
                }
                return Forbid();
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
                    UserName = model.Email,
                    UserInfo = new UserInfo
                    {
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                    }
                };

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
                    var result = await _userManager.CreateAsync(user, model.Password);
                    if (!result.Succeeded)
                        return StatusCode(StatusCodes.Status500InternalServerError);

                    await _userManager.AddToRoleAsync(user, "User");

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
            var oldRefreshToken = Request.GetRefreshToken();

            if (tokenModel is null || string.IsNullOrEmpty(tokenModel.RefreshToken) && string.IsNullOrEmpty(oldRefreshToken))
            {
                return BadRequest("Invalid client request");
            }

            if (string.IsNullOrEmpty(oldRefreshToken))
            {
                oldRefreshToken = tokenModel.RefreshToken;
            }

            var oldAccessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(oldAccessToken))
            {

            }

            var principal = _authHelper.GetPrincipalFromToken(oldAccessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token");
            }

            var email = principal.Identity.Name;

            var user = await _userManager.Users.Include(u => u.RefreshTokens).FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

            if (user == null || user.RefreshTokens.FirstOrDefault(t => t.Token == oldRefreshToken && t.TokenExpiryTime >= DateTime.Now) == null)
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

            var rToken = user.RefreshTokens.FirstOrDefault(t => t.Token == oldRefreshToken);

            if (rToken != null)
            {
                rToken.Token = newRefreshToken;
                rToken.TokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);
                rToken.DeviceType = clientInfo.UA.Family + " " + clientInfo.UA.Major + "." + clientInfo.UA.Minor;
            }

            _context.Users.Update(user);
            await _userManager.UpdateAsync(user);

            var newAccesTokenString = new JwtSecurityTokenHandler().WriteToken(newAccessToken);

            if (string.IsNullOrEmpty(oldRefreshToken))
            {
                Response.Cookies.AppendDefaultCookie(CookieConstants.AccessToken, newAccesTokenString);
                Response.Cookies.AppendDefaultCookie(CookieConstants.RefreshToken, newRefreshToken);
            }
            else
            {
                Response.Cookies.AppendDefaultCookie(CookieConstants.AccessToken, newAccesTokenString, 1);
                Response.Cookies.AppendDefaultCookie(CookieConstants.RefreshToken, newRefreshToken, 1);
            }

            return Ok(new TokenResponse()
            {
                AccessToken = newAccesTokenString,
                RefreshToken = newRefreshToken
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
        public async Task<IActionResult> Logout()
        {
            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token or refresh token");
                }

                string email = principal.Identity.Name;

                var refreshToken = Request.GetRefreshToken();

                if (string.IsNullOrEmpty(refreshToken))
                {
                    return BadRequest("Refresh Token missing.");
                }

                var refreshTokens = _context.RefreshTokens.Include(t => t.User).ToList();

                var tokensToDelete = refreshTokens.Where(t => t.User.Email.ToLower() == email.ToLower() && t.Token == refreshToken);

                _context.RefreshTokens.RemoveRange(tokensToDelete);
                await _context.SaveChangesAsync();
            }

            Response.Cookies.Delete(CookieConstants.AccessToken);
            Response.Cookies.Delete(CookieConstants.RefreshToken);

            return Ok();
        }

        #endregion

        #endregion
    }
}
