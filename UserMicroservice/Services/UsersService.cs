using AutoMapper;
using Azure.Core;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UserMicroservice.Enums;
using UserMicroservice.Extensions;
using UserMicroservice.Interfaces.Helpers;
using UserMicroservice.Interfaces.Services;
using UserMicroservice.Models;
using UserMicroservice.Models.Database;
using UserMicroservice.Models.Responses;

namespace UserMicroservice.Services
{
    public class UsersService : IUsersService
    {
        private readonly IAuthenticationHelper _authHelper;
        private readonly IHangfireHelper _hangfireHelper;

        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly IEmailService _emailService;

        private IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UsersService(IAuthenticationHelper authHelper,
                            IHangfireHelper hangfireHelper,
                            ApplicationDbContext context,
                            UserManager<ApplicationUser> userManager,
                            IEmailService emailService,
                            IMapper mapper,
                            IHttpContextAccessor httpContextAccessor)
        {
            _authHelper = authHelper;
            _hangfireHelper = hangfireHelper;
            _context = context;
            _userManager = userManager;
            _emailService = emailService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Response<List<RefreshTokenDTO>>> GetLoginsAsync(string email)
        {
            var refreshTokens = _mapper.Map<List<RefreshToken>, List<RefreshTokenDTO>>(await _context.RefreshTokens.Include(t => t.User).Where(t => t.User.Email == email).ToListAsync());

            if (refreshTokens == null)
                return new Response<List<RefreshTokenDTO>> { Status = StatusEnum.NotFound };

            return new Response<List<RefreshTokenDTO>> { Status = StatusEnum.Success, Data = refreshTokens };
        }

        public async Task<Response<GetUserInfoResponse>> GetUserInfoAsync(string email)
        {
            var userInfo = await _context.UserInfos.Include(u => u.User).FirstOrDefaultAsync(u => u.User.Email!.ToLower() == email.ToLower());

            if (userInfo == null)
                return new Response<GetUserInfoResponse> { Status = StatusEnum.NotFound, Message = "User info not found" };

            var response = new GetUserInfoResponse
            {
                Email = userInfo.User.Email,
                FirstName = userInfo.FirstName,
                LastName = userInfo.LastName
            };

            return new Response<GetUserInfoResponse> { Status = StatusEnum.Success, Data = response };
        }

        public async Task<Response<bool>> GetEmailVerificationAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

            if (user == null)
                return new Response<bool> { Status = StatusEnum.NotFound, Message = "User not found", Data = false };

            return new Response<bool> { Status = StatusEnum.Success, Data = true };
        }

        public async Task<Response<IList<string>>> GetUserRolesAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return new Response<IList<string>> { Status = StatusEnum.NotFound, Message = "User not found" };

            var userRoles = await _userManager.GetRolesAsync(user);

            return new Response<IList<string>> { Status = StatusEnum.Success, Data = userRoles };
        }

        public async Task<Response> VerifyEmailAsync(string emailToken)
        {
            var emailVerification = await _context.EmailVerificationsTokens.Include(e => e.User).Where(e => e.Token == emailToken && e.TokenExpiryTime > DateTime.Now).FirstOrDefaultAsync();
            if (emailVerification == null)
                return new Response { Status = StatusEnum.NotFound, Message = "Email verification not found" };

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == emailVerification.User.Id);
            if (user == null)
                return new Response { Status = StatusEnum.NotFound, Message = "User not found" };

            user.EmailConfirmed = true;
            _context.EmailVerificationsTokens.Remove(emailVerification);
            await _context.SaveChangesAsync();

            _hangfireHelper.DeleteJobByArgument(emailToken);

            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response<List<Address>>> GetAddressesAsync(string email)
        {
            var userInfo = await _context.UserInfos.Include(u => u.User).Include(a => a.Addresses).FirstOrDefaultAsync(u => u.User.Email!.ToLower() == email.ToLower());

            if (userInfo == null)
                return new Response<List<Address>> { Status = StatusEnum.NotFound, Message = "User info not found" };

            return new Response<List<Address>> { Status = StatusEnum.Success, Data = userInfo.Addresses };
        }

        public async Task<Response<Address>> GetAddressByIdAsync(string email, int addressId)
        {
            var userInfo = await _context.UserInfos.Include(u => u.User).Include(a => a.Addresses).FirstOrDefaultAsync(u => u.User.Email!.ToLower() == email.ToLower());

            if (userInfo == null || userInfo.Addresses == null)
                return new Response<Address> { Status = StatusEnum.NotFound, Message = "User info not found" };

            var address = userInfo.Addresses.FirstOrDefault(a => a.Id == addressId);

            if (address == null)
                return new Response<Address> { Status = StatusEnum.NotFound, Message = "Address not found" };

            return new Response<Address> { Status = StatusEnum.Success, Data = address };
        }

        public async Task<Response> ResendEmailVerificationAsync(string email)
        {
            var user = await _context.Users.Include(u => u.EmailVerificationToken).FirstOrDefaultAsync(u => u.Email!.ToLower() == email.ToLower());

            if (user == null)
                return new Response { Status = StatusEnum.NotFound, Message = "User not found" };

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

            if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null)
                return new Response { Status = StatusEnum.InternalError, Message = "Cannot access HttpContext" };

            var clientDomain = _httpContextAccessor.HttpContext.Request.Headers["Origin"].ToString();

            var confirmEmailLink = clientDomain + "/email/verify/" + emailVerificationToken;

            if (!_emailService.ResendConfirmEmail(user.Email!, confirmEmailLink))
                return new Response { Status = StatusEnum.InternalError, Message = "Email could not be sent" };

            await _userManager.UpdateAsync(user);

            BackgroundJob.Schedule<IHangfireService>(service => service.DeleteEmailVerification(emailVerificationToken), TimeSpan.FromHours(24));

            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response> RequestChangeEmailAsync(string oldEmail, string newEmail)
        {
            var user = await _context.Users.Include(u => u.ChangeEmailToken).FirstOrDefaultAsync(u => u.Email.ToLower() == oldEmail.ToLower());

            if (user == null)
                return new Response { Status = StatusEnum.NotFound, Message = "User not found" };

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
                NewEmail = newEmail,
                TokenExpiryTime = DateTime.Now.AddHours(1)
            };

            if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null)
                return new Response { Status = StatusEnum.InternalError, Message = "Cannot access HttpContext" };

            var clientDomain = _httpContextAccessor.HttpContext.Request.Headers["Origin"].ToString();

            var changeEmailLink = clientDomain + "/email/change/" + changeEmailToken;

            if (!_emailService.SendChangeEmail(oldEmail, changeEmailLink))
                return new Response { Status = StatusEnum.InternalError, Message = "Email could not be sent" };

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            BackgroundJob.Schedule<IHangfireService>(service => service.DeleteChangeEmailRequest(changeEmailToken), TimeSpan.FromHours(1));

            return new Response { Status = StatusEnum.Success };

        }

        public async Task<Response> AddAddressAsync(string email, Address address)
        {
            var userInfo = await _context.UserInfos.Include(u => u.Addresses).Include(u => u.User).FirstOrDefaultAsync(u => u.User.Email!.ToLower() == email.ToLower());

            if (userInfo == null)
                return new Response<List<Address>> { Status = StatusEnum.NotFound, Message = "User info not found" };

            userInfo.Addresses ??= new List<Address>();

            if (address.IsDefault)
            {
                foreach (var userAddress in userInfo.Addresses)
                {
                    userAddress.IsDefault = false;
                }
            }
            userInfo.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response> DeleteAccountAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email!.ToLower() == email.ToLower());
            if (user == null)
                return new Response { Status = StatusEnum.NotFound, Message = "User not found" };

            var result = await _userManager.CheckPasswordAsync(user, password);

            if (result)
            {
                await _userManager.DeleteAsync(user);
                return new Response { Status = StatusEnum.Success };
            }
            return new Response { Status = StatusEnum.Failure, Message = "Password doesn't match" };
        }

        public async Task<Response> ChangeNameAsync(string email, string firstName, string lastName)
        {
            var user = await _context.Users.Include(u => u.UserInfo).FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
            if (user == null)
                return new Response { Status = StatusEnum.NotFound, Message = "User not found" };

            user.UserInfo ??= new UserInfo();
            user.UserInfo.FirstName = firstName;
            user.UserInfo.LastName = lastName;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response> EditAddressAsync(string email, Address address)
        {
            var userInfo = _context.UserInfos.Include(u => u.Addresses).Include(u => u.Addresses).FirstOrDefault(u => u.User.Email.ToLower() == email.ToLower());

            if (userInfo == null || userInfo.Addresses == null)
                return new Response<List<Address>> { Status = StatusEnum.NotFound, Message = "User info not found" };

            var dbAddress = userInfo.Addresses.FirstOrDefault(a => a.Id == address.Id);
            if (dbAddress == null)
                return new Response<List<Address>> { Status = StatusEnum.NotFound, Message = "Address not found" };

            if (address.IsDefault)
            {
                foreach (var userAddress in userInfo.Addresses)
                {
                    userAddress.IsDefault = false;
                }
            }

            dbAddress.StreetAddress = address.StreetAddress;
            dbAddress.City = address.City;
            dbAddress.Region = address.Region;
            dbAddress.PostalCode = address.PostalCode;
            dbAddress.Country = address.Country;
            dbAddress.PhoneNumber = address.PhoneNumber;
            dbAddress.FirstName = address.FirstName;
            dbAddress.LastName = address.LastName;
            dbAddress.IsDefault = address.IsDefault;
            _context.UserInfos.Update(userInfo);
            await _context.SaveChangesAsync();

            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response> ChangeEmailAsync(string changeEmailToken)
        {
            var changeEmail = await _context.ChangeEmailTokens.Include(t => t.User).FirstOrDefaultAsync(t => t.Token == changeEmailToken);

            if (changeEmail == null)
                return new Response<List<Address>> { Status = StatusEnum.NotFound, Message = "Change email token not found" };

            changeEmail.User.Email = changeEmail.NewEmail;
            changeEmail.User.NormalizedEmail = changeEmail.NewEmail.ToUpper();
            changeEmail.User.UserName = changeEmail.NewEmail;
            changeEmail.User.NormalizedUserName = changeEmail.NewEmail.ToUpper();
            _context.Users.Update(changeEmail.User);
            _context.Remove(changeEmail);
            await _context.SaveChangesAsync();

            _hangfireHelper.DeleteJobByArgument(changeEmailToken);

            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response> ChangePasswordAsync(string email, string oldPassword, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var result = await _userManager.CheckPasswordAsync(user, oldPassword);
            if (!result)
                return new Response { Status = StatusEnum.Forbid };

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            if (!changePasswordResult.Succeeded)
                return new Response { Status = StatusEnum.InternalError, Message = "Internal error" };

            if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null)
                return new Response { Status = StatusEnum.InternalError, Message = "Cannot access HttpContext" };

            var refreshToken = _httpContextAccessor.HttpContext.Request.GetRefreshToken();
            if (string.IsNullOrEmpty(refreshToken))
                return new Response { Status = StatusEnum.Failure };

            var refreshTokensToDelete = _context.RefreshTokens.Include(r => r.User).Where(r => r.User.Email == email && r.Token != refreshToken);
            _context.RefreshTokens.RemoveRange(refreshTokensToDelete);
            await _context.SaveChangesAsync();

            return new Response { Status = StatusEnum.Success };

        }

        public async Task<Response> RevokeAllAsync(string email)
        {
            var refreshTokens = await _context.RefreshTokens.Include(t => t.User).Where(t => t.User.Email == email).ToListAsync();
            _context.RefreshTokens.RemoveRange(refreshTokens);
            await _context.SaveChangesAsync();

            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response> RevokeByIdAsync(string email, string id)
        {
            var refreshTokenToDelete = _context.RefreshTokens.Include(r => r.User).FirstOrDefault(t => t.Id == id);
            if (refreshTokenToDelete == null)
                return new Response { Status = StatusEnum.NotFound };

            if (refreshTokenToDelete.User.Email!.ToLower() != email.ToLower())
                return new Response { Status = StatusEnum.Forbid };

            _context.RefreshTokens.RemoveRange(refreshTokenToDelete);
            await _context.SaveChangesAsync();

            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response> RemoveAddressAsync(string email, string addressId)
        {
            var result = int.TryParse(addressId, out var parsedAddressId);
            if (!result)
                return new Response { Status = StatusEnum.Failure };

            var userInfo = await _context.UserInfos.Include(u => u.User).Include(u => u.Addresses).FirstOrDefaultAsync(u => u.User.Email!.ToLower() == email.ToLower());

            if (userInfo == null || userInfo.Addresses == null)
                return new Response { Status = StatusEnum.NotFound, Message = "User info not found" };

            var address = userInfo.Addresses.FirstOrDefault(a => a.Id == parsedAddressId);

            if (address == null)
                return new Response { Status = StatusEnum.NotFound, Message = "Address  not found" };

            userInfo.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return new Response { Status = StatusEnum.Success };
        }

        public async Task<Response<List<UserDTO>>> GetAllUsersAsync()
        {
            var users = await _context.Users.Include(u => u.UserInfo).ToListAsync();

            var mappedUsers = _mapper.Map<List<UserDTO>>(users);

            return new Response<List<UserDTO>>
            {
                Status = StatusEnum.Success,
                Data = mappedUsers
            };
        }

        public async Task<Response> ChangeActiveStatusAsync(string userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) 
                return new Response { Status = StatusEnum.Failure, Message = "User not found" };

            user.IsActive = !user.IsActive;

            _context.Users.Update(user);

            await _context.SaveChangesAsync();

            return new Response { Status = StatusEnum.Success };
        }
    }
}

