using Microsoft.AspNetCore.Identity;

namespace AuthMicroservice.Authentication.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<RefreshToken> RefreshTokens { get; set; }
    }
}
