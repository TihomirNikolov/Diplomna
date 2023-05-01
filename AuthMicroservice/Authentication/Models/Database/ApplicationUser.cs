using Microsoft.AspNetCore.Identity;

namespace AuthMicroservice.Authentication.Models.Database
{
    public class ApplicationUser : IdentityUser
    {
        public List<RefreshToken> RefreshTokens { get; set; } = default!;
        public EmailVerificationToken EmailVerificationToken { get; set; } = default!;
        public ResetPasswordToken ResetPasswordToken { get; set; } = default!;
    }
}
