using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using UserMicroservice.Models.Database;

namespace UserMicroservice.Interfaces.Helpers
{
    public interface IAuthenticationHelper
    {
        JwtSecurityToken CreateToken(List<Claim> authClaims);
        string GenerateToken();
        ClaimsPrincipal? GetPrincipalFromToken(string? token);
        string GetEmailFromAccessToken(string accessToken);
        Task<List<Claim>> GetClaims(ApplicationUser user);
    }
}
