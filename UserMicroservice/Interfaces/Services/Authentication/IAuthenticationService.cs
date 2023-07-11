using UserMicroservice.Models.Responses;

namespace UserMicroservice.Interfaces.Services.Authentication
{
    public interface IAuthenticationService
    {
        Task<Response<LoginResponse>> LoginAsync(string email, string password);
        Task<Response> RegisterAsync(string email, string password, string firstName, string lastName);
        Task<Response> ResetPasswordAsync(string resetToken, string password);
        Task<Response> LogoutAsync(string email, string accessToken, string refreshToken);
        Task<Response<LoginResponse>> IsLoggedAsync(string accessToken, string refreshToken);
    }
}
