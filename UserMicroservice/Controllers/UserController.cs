using AutoMapper;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserMicroservice.Authentication;
using UserMicroservice.Authentication.Helpers;
using UserMicroservice.Authentication.Models.Database;
using UserMicroservice.Authentication.Models.Requests;
using UserMicroservice.Authentication.Models.Responses;
using UserMicroservice.Extensions;
using UserMicroservice.Interfaces.Services;
using UserMicroservice.Interfaces.Services.Database;

namespace UserMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        #region Declarations

        private readonly AuthenticationHelper _authHelper;
        private readonly HangfireHelper _hangfireHelper;

        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly IEmailService _emailService;

        private readonly IMapper _mapper;

        #endregion

        #region Constructor

        public UserController(AuthenticationHelper authHelper,
                              ApplicationDbContext context,
                              IMapper mapper,
                              UserManager<ApplicationUser> userManager,
                              HangfireHelper hangfireHelper,
                              IEmailService emailService)
        {
            _authHelper = authHelper;
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            _hangfireHelper = hangfireHelper;
            _emailService = emailService;
        }

        #endregion

        #region Methods

        #region Get Methods

        [Authorize]
        [HttpGet]
        [Route("logins")]
        public async Task<IActionResult> GetLogins()
        {
            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token");
                }

                string email = principal.Identity.Name;

                var refreshTokens = _mapper.Map<List<RefreshToken>, List<RefreshTokenDTO>>(await _context.RefreshTokens.Include(t => t.User).Where(t => t.User.Email == email).ToListAsync());

                return Ok(refreshTokens);
            }

            return NotFound();
        }

        [Authorize]
        [HttpGet]
        [Route("userinfo")]
        public async Task<IActionResult> GetUserInfo()
        {
            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token");
                }

                string email = principal.Identity.Name;

                var userInfo = await _context.UserInfos.Include(u => u.User).FirstOrDefaultAsync(u => u.User.Email.ToLower() == email.ToLower());

                if (userInfo != null)
                {
                    var response = new GetUserInfoResponse
                    {
                        Email = userInfo.User.Email,
                        FirstName = userInfo.FirstName,
                        LastName = userInfo.LastName,
                    };

                    return Ok(response);
                }
            }

            return NotFound();
        }

        [Authorize]
        [HttpGet]
        [Route("emailVerification")]
        public async Task<IActionResult> GetEmailVerification()
        {
            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token");
                }

                string email = principal.Identity.Name;

                var isEmailConfirmed = _context.Users.Where(u => u.Email == email).Any(e => e.EmailConfirmed);

                return Ok(isEmailConfirmed);
            }
            return BadRequest();
        }


        [HttpGet]
        [Route("verify-email/{emailToken}")]
        public async Task<IActionResult> VerifyEmail(string emailToken)
        {
            if (emailToken == null)
            {
                return BadRequest();
            }
            var emailVerification = await _context.EmailVerificationsTokens.Include(e => e.User).Where(e => e.Token == emailToken && e.TokenExpiryTime > DateTime.Now).FirstOrDefaultAsync();
            if (emailVerification != null)
            {
                try
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == emailVerification.User.Id);
                    user.EmailConfirmed = true;
                    _context.EmailVerificationsTokens.Remove(emailVerification);
                    await _context.SaveChangesAsync();

                    _hangfireHelper.DeleteJobByArgument(emailToken);

                    return Ok(true);
                }
                catch
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

            return NotFound(false);
        }

        #endregion

        #region Post Methods

        [Authorize]
        [HttpPost]
        [Route("resend-email-verification")]
        public async Task<IActionResult> ResendVerification()
        {
            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token");
                }

                var user = await _context.Users.Include(u => u.EmailVerificationToken).Where(u => u.Email.ToLower() == principal.Identity.Name.ToLower()).FirstOrDefaultAsync();

                if (user != null)
                {
                    if (user.EmailVerificationToken != null)
                    {
                        _context.EmailVerificationsTokens.Remove(user.EmailVerificationToken);
                        await _context.SaveChangesAsync();
                    }
                    var emailVerificationToken = _authHelper.GenerateToken();

                    user.EmailVerificationToken = new EmailVerificationToken()
                    {
                        Token = emailVerificationToken,
                        TokenExpiryTime = DateTime.Now.AddDays(1),
                        CreatedTime = DateTime.Now,
                    };

                    await _userManager.UpdateAsync(user);

                    return Ok();
                }
            }
            return BadRequest();
        }

        [Authorize]
        [HttpPost]
        [Route("request-change-email")]
        public async Task<IActionResult> ReqeustChangeEmail([FromBody] ChangeEmailRequest request)
        {
            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token");
                }

                var email = principal.Identity.Name;

                var user = await _context.Users.Include(u => u.ChangeEmailToken).FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

                if (user != null)
                {
                    if(user.ChangeEmailToken != null)
                    {
                        _context.ChangeEmailTokens.Remove(user.ChangeEmailToken);
                        await _context.SaveChangesAsync();
                    }

                    var changeEmailToken = _authHelper.GenerateToken();

                    user.ChangeEmailToken = new ChangeEmailToken
                    {
                        Token = changeEmailToken,
                        CreatedTime = DateTime.Now,
                        NewEmail = request.Email,
                        TokenExpiryTime = DateTime.Now.AddHours(1)
                    };

                    var clientDomain = Request.Headers["Origin"].ToString();

                    var changeEmailLink = clientDomain + "/email/change/" + changeEmailToken;

                    if (_emailService.SendChangeEmail(email, changeEmailLink))
                    {
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();

                        BackgroundJob.Schedule<IUsersService>(service => service.DeleteChangeEmailRequest(changeEmailToken), TimeSpan.FromHours(1));
                        return Ok();
                    }
                }
            }

            return NotFound();
        }

        #endregion

        #region Put Methods

        [Authorize]
        [HttpPut]
        [Route("change-name")]
        public async Task<IActionResult> ChangeName([FromBody] ChangeNameRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.FirstName) || string.IsNullOrEmpty(request.LastName))
            {
                return BadRequest();
            }

            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token or refresh token");
                }

                string email = principal.Identity.Name;

                var user = await _context.Users.Include(u => u.UserInfo).FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
                if (user != null)
                {
                    if (user.UserInfo == null)
                    {
                        user.UserInfo = new UserInfo();
                    }
                    user.UserInfo.FirstName = request.FirstName;
                    user.UserInfo.LastName = request.LastName;

                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    return Ok();
                }
            }

            return NotFound();
        }

        [HttpPut]
        [Route("change-email/{changeEmailToken}")]
        public async Task<IActionResult> ChangeEmail(string changeEmailToken)
        {
            if (string.IsNullOrEmpty(changeEmailToken))
            {
                return BadRequest();
            }

            var changeEmail = await _context.ChangeEmailTokens.Include(t => t.User).FirstOrDefaultAsync(t => t.Token == changeEmailToken);
            
            if(changeEmail == null)
            {
                return NotFound();
            }

            changeEmail.User.Email = changeEmail.NewEmail;
            changeEmail.User.NormalizedEmail = changeEmail.NewEmail.ToUpper();
            changeEmail.User.UserName = changeEmail.NewEmail;
            changeEmail.User.NormalizedUserName = changeEmail.NewEmail.ToUpper();
            _context.Users.Update(changeEmail.User);
            _context.Remove(changeEmail);
            await _context.SaveChangesAsync();

            _hangfireHelper.DeleteJobByArgument(changeEmailToken);

            return Ok();
        }


        [Authorize]
        [HttpPut]
        [Route("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest passwordModel)
        {
            var accessToken = Request.GetAuthorizationToken();

            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Refresh Token missing.");
            }

            var principal = _authHelper.GetPrincipalFromToken(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            string email = principal.Identity.Name;

            var user = await _userManager.FindByEmailAsync(email);

            var result = await _userManager.CheckPasswordAsync(user, passwordModel.OldPassword);
            if (result)
            {
                var changePasswordResult = await _userManager.ChangePasswordAsync(user, passwordModel.OldPassword, passwordModel.NewPassword);
                if (!changePasswordResult.Succeeded)
                {
                    return BadRequest();
                }

                var refreshToken = Request.GetRefreshToken();
                if (!string.IsNullOrEmpty(refreshToken))
                {
                    var refreshTokensToDelete = _context.RefreshTokens.Include(r => r.User).Where(r => r.User.Email == email && r.Token != refreshToken);
                    _context.RefreshTokens.RemoveRange(refreshTokensToDelete);
                    await _context.SaveChangesAsync();
                }

                return Ok();
            }

            return BadRequest("Password not valid.");
        }

        #endregion

        #region Delete Methods

        [Authorize]
        [HttpDelete]
        [Route("revoke-all")]
        public async Task<IActionResult> Revoke()
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

                var refreshTokens = await _context.RefreshTokens.Include(t => t.User).Where(t => t.User.Email == email).ToListAsync();
                _context.RefreshTokens.RemoveRange(refreshTokens);
                await _context.SaveChangesAsync();

                return Ok();
            }
            return NotFound();
        }

        [Authorize]
        [HttpDelete]
        [Route("revoke/{id}")]
        public async Task<IActionResult> RevokeBySessionId(string id)
        {
            if (id == null || string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token or refresh token");
                }

                string email = principal.Identity.Name;

                var refreshTokenToDelete = _context.RefreshTokens.FirstOrDefault(t => t.Id == id);
                if (refreshTokenToDelete != null)
                {
                    _context.RefreshTokens.RemoveRange(refreshTokenToDelete);
                    await _context.SaveChangesAsync();
                    return Ok();
                }
            }

            return NotFound();
        }

        #endregion

        #endregion
    }
}
