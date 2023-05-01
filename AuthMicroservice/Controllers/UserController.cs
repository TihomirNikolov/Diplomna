using AuthMicroservice.Authentication.Helpers;
using AuthMicroservice.Authentication.Models.Database;
using AuthMicroservice.Authentication.Models.Requests;
using AuthMicroservice.Authentication.Models.Responses;
using AuthMicroservice.Database;
using AutoMapper;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net.Http.Headers;

namespace AuthMicroservice.Controllers
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

        private readonly IMapper _mapper;

        #endregion

        #region Constructor

        public UserController(AuthenticationHelper authHelper,
                              ApplicationDbContext context,
                              IMapper mapper,
                              UserManager<ApplicationUser> userManager,
                              HangfireHelper hangfireHelper)
        {
            _authHelper = authHelper;
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            _hangfireHelper = hangfireHelper;
        }

        #endregion

        #region Methods

        #region Get Methods

        [Authorize]
        [HttpGet]
        [Route("logins")]
        public async Task<IActionResult> GetLogins([FromHeader] string authorization)
        {
            if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
            {
                var accessToken = headerValue.Parameter;

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
        [Route("emailVerification")]
        public async Task<IActionResult> GetEmailVerification([FromHeader] string authorization)
        {
            if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
            {
                var accessToken = headerValue.Parameter;

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
        public async Task<IActionResult> ResendVerification([FromHeader] string authorization)
        {
            if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
            {
                var accessToken = headerValue.Parameter;

                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token");
                }

                var user = await _context.Users.Include(u => u.EmailVerificationToken).Where(u => u.Email.ToLower() == principal.Identity.Name.ToLower()).FirstOrDefaultAsync();

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
            return BadRequest();
        }

        [Authorize]
        [HttpPost]
        [Route("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest passwordModel)
        {
            var accessToken = Request.Headers["Authorization"].ToString().Split(' ')[1];

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
                return Ok();
            }

            return BadRequest("Password not valid.");
        }

        #endregion

        #region Delete Methods

        [Authorize]
        [HttpDelete]
        [Route("revoke-all")]
        public async Task<IActionResult> Revoke([FromHeader] string authorization)
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

                var refreshTokens = await _context.RefreshTokens.Include(t => t.User).Where(t => t.User.Email == email).ToListAsync();
                _context.RefreshTokens.RemoveRange(refreshTokens);
                await _context.SaveChangesAsync();

                return Ok();
            }
            return NotFound();
        }

        [Authorize]
        [HttpDelete]
        [Route("revoke")]
        public async Task<IActionResult> RevokeBySessionId([FromHeader] string authorization)
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

                var refreshTokenToDelete = _context.RefreshTokens.FirstOrDefault(t => t.Id == refreshToken);
                if (refreshTokenToDelete != null)
                {
                    _context.RefreshTokens.RemoveRange(refreshTokenToDelete);
                    await _context.SaveChangesAsync();
                }
                return Ok();
            }

            return NotFound();
        }

        #endregion

        #endregion
    }
}
