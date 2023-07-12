using AutoMapper;
using Azure.Core;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using UserMicroservice.Enums;
using UserMicroservice.Extensions;
using UserMicroservice.Interfaces.Helpers;
using UserMicroservice.Interfaces.Services;
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

        private readonly IAuthenticationHelper _authHelper;

        private readonly IUsersService _userService;

        private readonly IMapper _mapper;

        #endregion

        #region Constructor

        public UserController(IAuthenticationHelper authHelper,
                              IUsersService usersService,
                              IMapper mapper)
        {
            _authHelper = authHelper;
            _userService = usersService;
            _mapper = mapper;
        }

        #endregion

        #region Methods

        #region Get Methods

        [Authorize]
        [HttpGet]
        [Route("logins")]
        public async Task<IActionResult> GetLogins()
        {
            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.GetLoginsAsync(email);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok(result.Data);
        }

        [Authorize]
        [HttpGet]
        [Route("userinfo")]
        public async Task<IActionResult> GetUserInfo()
        {
            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.GetUserInfoAsync(email);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok(result.Data);
        }

        [Authorize]
        [HttpGet]
        [Route("emailVerification")]
        public async Task<IActionResult> GetEmailVerification()
        {
            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.GetEmailVerificationAsync(email);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok(result.Data);
        }

        [Authorize]
        [HttpGet]
        [Route("roles")]
        public async Task<IActionResult> GetUserRoles()
        {
            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.GetUserRolesAsync(email);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("verify-email/{emailToken}")]
        public async Task<IActionResult> VerifyEmail(string emailToken)
        {
            if (emailToken == null)
            {
                return BadRequest();
            }

            var result = await _userService.VerifyEmailAsync(emailToken);

            if (result.Status == StatusEnum.NotFound)
                return NotFound(false);

            return Ok(true);
        }

        [Authorize]
        [HttpGet]
        [Route("addresses")]
        public async Task<IActionResult> GetAddresses()
        {
            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.GetAddressesAsync(email);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok(result.Data);
        }

        [Authorize]
        [HttpGet]
        [Route("address/id/{id}")]
        public async Task<IActionResult> GetAddressById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest();

            if (!int.TryParse(id, out int parsedId))
                return BadRequest();

            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.GetAddressByIdAsync(email, parsedId);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok(result.Data);
        }

        #endregion

        #region Post Methods

        [Authorize]
        [HttpPost]
        [Route("resend-email-verification")]
        public async Task<IActionResult> ResendVerification()
        {
            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.ResendEmailVerificationAsync(email);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            if (result.Status == StatusEnum.InternalError)
                return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("request-change-email")]
        public async Task<IActionResult> ReqeustChangeEmail([FromBody] ChangeEmailRequest request)
        {
            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.RequestChangeEmailAsync(email, request.Email);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            if (result.Status == StatusEnum.InternalError)
                return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("add-new-address")]
        public async Task<IActionResult> AddAdress([FromBody] AddAddressRequest request)
        {
            if (request == null)
                return BadRequest();

            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.AddAddressAsync(email, _mapper.Map<Address>(request));

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> DeleteAccount([FromBody] DeleteRequest request)
        {
            if (request == null)
                return BadRequest();

            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            if (email != request.Email)
                return Forbid();

            var result = await _userService.DeleteAccountAsync(request.Email, request.Password);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            if (result.Status == StatusEnum.Failure)
                return Forbid();

            return Ok();
        }

        #endregion

        #region Put Methods

        [Authorize]
        [HttpPut]
        [Route("change-name")]
        public async Task<IActionResult> ChangeName([FromBody] ChangeNameRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.FirstName) || string.IsNullOrEmpty(request.LastName))
                return BadRequest();

            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.ChangeNameAsync(email, request.FirstName, request.LastName);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok();
        }

        [Authorize]
        [HttpPut]
        [Route("edit-address")]
        public async Task<IActionResult> EditAddress([FromBody] EditAddressRequest request)
        {
            if (request == null)
                return BadRequest();

            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.EditAddressAsync(email, _mapper.Map<Address>(request));

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok();
        }

        [HttpPut]
        [Route("change-email/{changeEmailToken}")]
        public async Task<IActionResult> ChangeEmail(string changeEmailToken)
        {
            if (string.IsNullOrEmpty(changeEmailToken))
            {
                return BadRequest();
            }

            var result = await _userService.ChangeEmailAsync(changeEmailToken);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            return Ok();
        }


        [Authorize]
        [HttpPut]
        [Route("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest passwordModel)
        {
            if (passwordModel == null || string.IsNullOrEmpty(passwordModel.OldPassword) || string.IsNullOrEmpty(passwordModel.NewPassword))
                return BadRequest();

            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.ChangePasswordAsync(email, passwordModel.OldPassword, passwordModel.NewPassword);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            if (result.Status == StatusEnum.InternalError)
                return StatusCode(StatusCodes.Status500InternalServerError);

            if (result.Status == StatusEnum.Failure)
                return BadRequest();

            if (result.Status == StatusEnum.Forbid)
                return Forbid();

            return Ok();
        }

        #endregion

        #region Delete Methods

        [Authorize]
        [HttpDelete]
        [Route("revoke-all")]
        public async Task<IActionResult> Revoke()
        {
            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            await _userService.RevokeAllAsync(email);

            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("revoke/{id}")]
        public async Task<IActionResult> RevokeBySessionId(string id)
        {
            if (id == null || string.IsNullOrEmpty(id))
                return BadRequest();

            var email = Request.GetEmailFromRequest(_authHelper);

            if (string.IsNullOrEmpty(email))
                return Forbid();

            var result = await _userService.RevokeByIdAsync(email, id);

            if (result.Status == StatusEnum.NotFound)
                return NotFound();

            if (result.Status == StatusEnum.Forbid)
                return Forbid();

            return Ok();
        }

        #endregion

        #endregion
    }
}
