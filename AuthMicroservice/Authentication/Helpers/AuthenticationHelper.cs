using AuthMicroservice.Database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AuthMicroservice.Authentication.Helpers
{
    public class AuthenticationHelper
    {
        #region Declarations
        /// <summary>
        /// Грижи се за записването в базата на информация за потребителя
        /// </summary>
        private readonly UserManager<ApplicationUser> userManager;

        /// <summary>
        /// Настройки за jwt тоукенът
        /// </summary>
        private readonly IConfigurationSection jwtSettings;

        #endregion

        #region Constructors

        public AuthenticationHelper(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            jwtSettings = configuration.GetSection("JWT");
        }

        #endregion

        public JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]));
            _ = int.TryParse(jwtSettings["TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["ValidIssuer"],
                audience: jwtSettings["ValidAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }
    }
}
