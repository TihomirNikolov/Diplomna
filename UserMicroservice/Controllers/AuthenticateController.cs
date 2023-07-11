using Azure.Core;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using UAParser;
using UserMicroservice.Enums;
using UserMicroservice.Extensions;
using UserMicroservice.Helpers;
using UserMicroservice.Helpers.Constants;
using UserMicroservice.Interfaces.Helpers;
using UserMicroservice.Interfaces.Services;
using UserMicroservice.Interfaces.Services.Authentication;
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

        private readonly IAuthenticationHelper _authHelper;
        private readonly IHangfireHelper _hangfireHelper;

        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly IEmailService _emailService;
        private readonly IAuthenticationService _authService;
        private readonly ITokenService _tokenService;

        private readonly IConfiguration _configuration;

        #endregion

        #region Constructor

        public AuthenticateController(IAuthenticationHelper authHelper,
                                      IHangfireHelper hangfireHelper,
                                      UserManager<ApplicationUser> userManager,
                                      ApplicationDbContext context,
                                      IEmailService emailService,
                                      IAuthenticationService authService,
                                      ITokenService tokenService,
                                      IConfiguration configuration)
        {
            _authHelper = authHelper;
            _hangfireHelper = hangfireHelper;
            _userManager = userManager;
            _context = context;
            _emailService = emailService;
            _authService = authService;
            _tokenService = tokenService;
            _configuration = configuration;
        }

        #endregion

        #region Methods

        #region Get Methods

        [HttpGet]
        [Route("verify-password-token/{token}")]
        public async Task<IActionResult> VerifyPasswordToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest(false);

            var result = await _tokenService.VerifyPasswordTokenAsync(token);

            if (result.Status == StatusEnum.NotFound)
                return NotFound(false);
            return Ok(true);
        }

        [Authorize]
        [HttpGet]
        [Route("is-logged")]
        public async Task<IActionResult> IsLogged()
        {
            var accessToken = Request.GetAuthorizationToken();
            var refreshToken = Request.GetRefreshToken();

            if (string.IsNullOrEmpty(accessToken))
                return BadRequest("Access token is missing.");

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest("Refresh token is missing .");

            var result = await _authService.IsLoggedAsync(accessToken, refreshToken);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok(result);
        }

        [HttpGet]
        [Route("get-user-email/{token}")]
        public IActionResult GetTokenInfo(string token)
        {
            var email = _authHelper.GetEmailFromAccessToken(token);

            if (string.IsNullOrEmpty(email))
                return NotFound();

            return Ok(email);
        }

        #endregion

        #region Post Methods

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                return BadRequest();

            var result = await _authService.LoginAsync(model.Email, model.Password);

            if (result.Status == StatusEnum.Failure || result.Data == null)
                return Forbid();

            if (result.Status == StatusEnum.InternalError)
                return StatusCode(StatusCodes.Status500InternalServerError);

            if (model.RememberMe)
            {
                Response.Cookies.AppendDefaultCookie(CookieConstants.AccessToken, result.Data.AccessToken);
                Response.Cookies.AppendDefaultCookie(CookieConstants.RefreshToken, result.Data.RefreshToken);
            }
            else
            {
                Response.Cookies.AppendDefaultCookie(CookieConstants.AccessToken, result.Data.AccessToken, 1);
                Response.Cookies.AppendDefaultCookie(CookieConstants.RefreshToken, result.Data.RefreshToken, 1);
            }

            return Ok(new LoginResponse
            {
                AccessToken = result.Data.AccessToken,
                RefreshToken = result.Data.RefreshToken,
                IsEmailConfirmed = result.Data.IsEmailConfirmed,
                Roles = result.Data.Roles
            });
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password) ||
                string.IsNullOrEmpty(model.FirstName) || string.IsNullOrEmpty(model.LastName))
                return BadRequest();

            var result = await _authService.RegisterAsync(model.Email, model.Password, model.FirstName, model.LastName);

            if (result.Status == StatusEnum.Conflict)
                return Conflict();
            else if (result.Status == StatusEnum.InternalError)
                return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok();
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest tokenModel)
        {
            var oldRefreshToken = Request.GetRefreshToken();
            var oldAccessToken = Request.GetAuthorizationToken();

            if (tokenModel is null || (string.IsNullOrEmpty(tokenModel.RefreshToken) &&
                string.IsNullOrEmpty(oldRefreshToken)) || string.IsNullOrEmpty(oldAccessToken))
                return BadRequest("Invalid client request");

            if (string.IsNullOrEmpty(oldRefreshToken))
                oldRefreshToken = tokenModel.RefreshToken;

            var email = Request.GetEmailFromRequest(_authHelper);

            var result = await _tokenService.RefreshTokenAsync(email, oldRefreshToken, oldAccessToken);

            if (string.IsNullOrEmpty(oldRefreshToken))
            {
                Response.Cookies.AppendDefaultCookie(CookieConstants.AccessToken, result.Data.AccessToken);
                Response.Cookies.AppendDefaultCookie(CookieConstants.RefreshToken, result.Data.RefreshToken);
            }
            else
            {
                Response.Cookies.AppendDefaultCookie(CookieConstants.AccessToken, result.Data.AccessToken, 1);
                Response.Cookies.AppendDefaultCookie(CookieConstants.RefreshToken, result.Data.RefreshToken, 1);
            }

            return Ok(new TokenResponse()
            {
                AccessToken = result.Data.AccessToken,
                RefreshToken = result.Data.RefreshToken
            });
        }

        [HttpPost]
        [Route("reset-password-token")]
        public async Task<IActionResult> GenerateResetPasswordToken([FromBody] GenerateResetPasswordTokenRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
                return BadRequest();

            var result = await _tokenService.GenerateResetPasswordTokenAsync(request.Email);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();
            else if (result.Status == StatusEnum.InternalError)
                return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok();
        }


        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.ResetToken))
                return BadRequest();

            var result = await _authService.ResetPasswordAsync(request.ResetToken, request.Password);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();
            else if (result.Status == StatusEnum.InternalError)
                return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok();
        }

        #endregion

        #region Delete Methods

        [Authorize]
        [HttpDelete]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            var accessToken = Request.GetAuthorizationToken();
            var refreshToken = Request.GetRefreshToken();
            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(accessToken))
                return BadRequest();

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest("Refresh Token missing.");

            var result = await _authService.LogoutAsync(email, accessToken, refreshToken);

            Response.Cookies.Delete(CookieConstants.AccessToken);
            Response.Cookies.Delete(CookieConstants.RefreshToken);

            return Ok();
        }

        #endregion

        #endregion
    }
}
