using Microsoft.AspNetCore.Identity;

namespace UserMicroservice.Models.Database
{
    public class ApplicationUser : IdentityUser
    {
        public string? UserInfoId { get; set; }
        public UserInfo? UserInfo { get; set; }
        public List<RefreshToken> RefreshTokens { get; set; } = default!;
        public EmailVerificationToken EmailVerificationToken { get; set; } = default!;
        public ResetPasswordToken ResetPasswordToken { get; set; } = default!;
        public ChangeEmailToken ChangeEmailToken { get; set; } = default!;
    }
}
