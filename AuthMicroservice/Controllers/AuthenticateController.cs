using AuthMicroservice.Authentication.Enums;
using AuthMicroservice.Authentication.Helpers;
using AuthMicroservice.Authentication.Models;
using AuthMicroservice.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http.Headers;
using System.Net;
using Azure.Core;

namespace AuthMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly AuthenticationHelper _authHelper;
        private readonly ApplicationDbContext _context;

        public AuthenticateController(UserManager<ApplicationUser> userManager,
                                      RoleManager<IdentityRole> roleManager,
                                      IConfiguration configuration,
                                      AuthenticationHelper authHelper,
                                      ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _authHelper = authHelper;
            _context = context;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (model != null)
            {
                var user = await _userManager.Users.Include(u => u.RefreshTokens).SingleAsync(u => model.Email.ToLower() == u.Email.ToLower());
                if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    var authClaims = await _authHelper.GetClaims(user);

                    var token = _authHelper.CreateToken(authClaims);
                    var refreshToken = _authHelper.GenerateRefreshToken();

                    _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

                    if(user.RefreshTokens == null)
                    {
                        user.RefreshTokens = new List<RefreshToken>();
                    }

                    user.RefreshTokens.Add(new RefreshToken()
                    {
                        Token = refreshToken,
                        TokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays)
                    });

                    await _userManager.UpdateAsync(user);
                    var isEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user);

                    return Ok(new
                    {
                        AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
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
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (model != null)
            {
                var userExists = await _userManager.FindByEmailAsync(model.Email);
                if (userExists != null)
                    return StatusCode(StatusCodes.Status409Conflict, new Response { Status = "Error", Message = "User already exists!" });

                ApplicationUser user = new()
                {
                    Email = model.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = model.Email
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

                return Ok(new Response { Status = "Success", Message = "User created successfully!" });
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Email);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            ApplicationUser user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Email
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            if (!await _roleManager.RoleExistsAsync(UserRolesEnum.Admin.ToString()))
                await _roleManager.CreateAsync(new IdentityRole(UserRolesEnum.Admin.ToString()));
            if (!await _roleManager.RoleExistsAsync(UserRolesEnum.User.ToString()))
                await _roleManager.CreateAsync(new IdentityRole(UserRolesEnum.User.ToString()));

            if (await _roleManager.RoleExistsAsync(UserRolesEnum.Admin.ToString()))
            {
                await _userManager.AddToRoleAsync(user, UserRolesEnum.Admin.ToString());
            }
            if (await _roleManager.RoleExistsAsync(UserRolesEnum.Admin.ToString()))
            {
                await _userManager.AddToRoleAsync(user, UserRolesEnum.User.ToString());
            }
            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenModel tokenModel)
        {
            if (tokenModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string? accessToken = tokenModel.AccessToken;
            string? refreshToken = tokenModel.RefreshToken;

            var principal = _authHelper.GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            string email = principal.Identity.Name;

            var user = await _userManager.Users.Include(u => u.RefreshTokens).SingleAsync(u => email.ToLower() == u.Email.ToLower());

            if (user == null || user.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken && t.TokenExpiryTime >= DateTime.Now) == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            var newAccessToken = _authHelper.CreateToken(principal.Claims.ToList());
            var newRefreshToken = _authHelper.GenerateRefreshToken();

            _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

            user.RefreshTokens.Add(new RefreshToken()
            {
                Token = newRefreshToken,
                TokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays)
            });

            _context.RefreshTokens.Remove(user.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken));
            await _userManager.UpdateAsync(user);

            return Ok(new TokenModel()
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                RefreshToken = newRefreshToken
            });
        }

        [HttpPost]
        [Route("revoke/{email}")]
        public async Task<IActionResult> Revoke(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return BadRequest("Invalid user name");

            _context.RefreshTokens.RemoveRange(_context.RefreshTokens.Where(t => t.User.Email.ToLower() == email.ToLower()));
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("revoke-all")]
        public async Task<IActionResult> RevokeAll()
        {
            _context.RefreshTokens.RemoveRange(_context.RefreshTokens);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout([FromHeader] string authorization)
        {
            if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
            {
                var accessToken = headerValue.Parameter;

                var principal = _authHelper.GetPrincipalFromExpiredToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token or refresh token");
                }

                string email = principal.Identity.Name;

                var refreshToken = Request.Headers["RefreshToken"].ToString();

                var refreshTokens = _context.RefreshTokens.Include(t => t.User).ToList();

                var tokensToDelete = refreshTokens.Where(t => t.User.Email.ToLower() == email.ToLower() && t.Token == refreshToken);

                _context.RefreshTokens.RemoveRange(tokensToDelete);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
