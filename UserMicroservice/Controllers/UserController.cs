using AutoMapper;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserMicroservice.Extensions;
using UserMicroservice.Helpers;
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

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
                if (user != null)
                {
                    return Ok(user.EmailConfirmed);
                }
            }
            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("roles")]
        public async Task<IActionResult> GetUserRoles()
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

                var user = await _userManager.FindByEmailAsync(email);
                if (user != null)
                {
                    var userRoles = await _userManager.GetRolesAsync(user);

                    return Ok(userRoles);
                }
            }
            return NotFound();
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

        [Authorize]
        [HttpGet]
        [Route("addresses")]
        public async Task<IActionResult> GetAddresses()
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

                var userInfo = await _context.UserInfos.Include(u => u.User).Include(a => a.Addresses).FirstOrDefaultAsync(u => u.User.Email.ToLower() == email.ToLower());

                if (userInfo != null)
                {
                    return Ok(userInfo.Addresses);
                }
            }

            return NotFound();
        }

        [Authorize]
        [HttpGet]
        [Route("address/id/{id}")]
        public async Task<IActionResult> GetAddressById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            if (!int.TryParse(id, out int parsedId))
            {
                return BadRequest();
            }

            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token");
                }

                var email = principal.Identity.Name;

                var userInfo = await _context.UserInfos.Include(u => u.User).Include(a => a.Addresses).FirstOrDefaultAsync(u => u.User.Email.ToLower() == email.ToLower());

                if (userInfo != null && userInfo.Addresses != null)
                {
                    var address = userInfo.Addresses.FirstOrDefault(a => a.Id == parsedId);
                    return Ok(address);
                }
            }

            return NotFound();
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

                var user = await _context.Users.Include(u => u.EmailVerificationToken).FirstOrDefaultAsync(u => u.Email.ToLower() == principal.Identity.Name.ToLower());

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

                    var clientDomain = Request.Headers["Origin"].ToString();

                    var confirmEmailLink = clientDomain + "/email/verify/" + emailVerificationToken;

                    if (_emailService.ResendConfirmEmail(user.Email, confirmEmailLink))
                    {
                        await _userManager.UpdateAsync(user);

                        BackgroundJob.Schedule<IUsersService>(service => service.DeleteEmailVerification(emailVerificationToken), TimeSpan.FromHours(24));
                        return Ok();
                    }
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
                    if (user.ChangeEmailToken != null)
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

        [Authorize]
        [HttpPost]
        [Route("add-new-address")]
        public async Task<IActionResult> AddAdress([FromBody] AddAddressRequest request)
        {
            if (request == null)
                return BadRequest();

            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token");
                }

                var email = principal.Identity.Name;

                var userInfo = await _context.UserInfos.Include(u => u.Addresses).Include(u => u.User).FirstOrDefaultAsync(u => u.User.Email.ToLower() == email.ToLower());

                if (userInfo != null)
                {
                    var address = _mapper.Map<Address>(request);

                    if (address != null)
                    {
                        if (userInfo.Addresses == null)
                        {
                            userInfo.Addresses = new List<Address>();
                        }
                        if (address.IsDefault)
                        {
                            foreach (var userAddress in userInfo.Addresses)
                            {
                                userAddress.IsDefault = false;
                            }
                        }
                        userInfo.Addresses.Add(address);
                        await _context.SaveChangesAsync();
                        return Ok();
                    }
                }
            }

            return NotFound();
        }

        [Authorize]
        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> DeleteAccount([FromBody] DeleteRequest request)
        {
            if (request == null)
                return BadRequest();

            var accessToken = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authHelper.GetPrincipalFromToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token");
                }

                var email = principal.Identity.Name;

                if(email != request.Email)
                {
                    return Forbid();
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
                if (user != null)
                {
                    var result = await _userManager.CheckPasswordAsync(user, request.Password);

                    if (result)
                    {
                        await _userManager.DeleteAsync(user);

                        return Ok();
                    }
                    return Forbid();
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

        [Authorize]
        [HttpPut]
        [Route("edit-address")]
        public async Task<IActionResult> EditAddress([FromBody] EditAddressRequest request)
        {
            if (request == null)
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

                var userInfo = _context.UserInfos.Include(u => u.Addresses).Include(u => u.Addresses).FirstOrDefault(u => u.User.Email.ToLower() == email.ToLower());

                if (userInfo != null && userInfo.Addresses != null)
                {
                    var address = userInfo.Addresses.FirstOrDefault(a => a.Id == request.Id);
                    if (address != null)
                    {
                        if (request.IsDefault)
                        {
                            foreach (var userAddress in userInfo.Addresses)
                            {
                                userAddress.IsDefault = false;
                            }
                        }

                        address.StreetAddress = request.StreetAddress;
                        address.City = request.City;
                        address.Region = request.Region;
                        address.PostalCode = request.PostalCode;
                        address.Country = request.Country;
                        address.PhoneNumber = request.PhoneNumber;
                        address.FirstName = request.FirstName;
                        address.LastName = request.LastName;
                        address.IsDefault = request.IsDefault;
                        _context.UserInfos.Update(userInfo);
                        await _context.SaveChangesAsync();
                        return Ok();
                    }
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

            if (changeEmail == null)
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
