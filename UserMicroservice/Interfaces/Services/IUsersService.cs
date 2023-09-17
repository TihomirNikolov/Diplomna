using UserMicroservice.Models.Database;
using UserMicroservice.Models.Responses;

namespace UserMicroservice.Interfaces.Services
{
    public interface IUsersService
    {
        Task<Response<List<RefreshTokenDTO>>> GetLoginsAsync(string email);
        Task<Response<GetUserInfoResponse>> GetUserInfoAsync(string email);
        Task<Response<bool>> GetEmailVerificationAsync(string email);
        Task<Response<IList<string>>> GetUserRolesAsync(string email);
        Task<Response> VerifyEmailAsync(string emailToken);
        Task<Response<List<Address>>> GetAddressesAsync(string email);
        Task<Response<Address>> GetAddressByIdAsync(string email, int addressId);
        Task<Response> ResendEmailVerificationAsync(string email);
        Task<Response> RequestChangeEmailAsync(string oldEmail, string newEmail);
        Task<Response> AddAddressAsync(string email, Address address);
        Task<Response> DeleteAccountAsync(string email, string password);
        Task<Response> ChangeNameAsync(string email, string firstName, string lastName);
        Task<Response> EditAddressAsync(string email, Address address);
        Task<Response> ChangeEmailAsync(string changeEmailToken);
        Task<Response> ChangePasswordAsync(string email, string oldPassword, string newPassword);
        Task<Response> RevokeAllAsync(string email);
        Task<Response> RevokeByIdAsync(string email, string id);
        Task<Response> RemoveAddressAsync(string email, string addressId);
        Task<Response<List<UserDTO>>> GetAllUsersAsync();
        Task<Response> ChangeActiveStatusAsync(string userId);
    }
}
