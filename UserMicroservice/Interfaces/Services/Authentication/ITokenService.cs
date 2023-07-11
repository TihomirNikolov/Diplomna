using UserMicroservice.Models.Responses;

namespace UserMicroservice.Interfaces.Services.Authentication
{
    public interface ITokenService
    {
        Task<Response<TokenResponse>> RefreshTokenAsync(string email, string oldRefreshToken, string oldAccessToken);
        Task<Response> GenerateResetPasswordTokenAsync(string email);
        Task<Response> VerifyPasswordTokenAsync(string token);
    }
}
