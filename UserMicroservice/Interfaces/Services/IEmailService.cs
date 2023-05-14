namespace UserMicroservice.Interfaces.Services
{
    public interface IEmailService
    {
        bool SendConfirmEmail(string destinationEmail, string confirmEmailLink);
        bool ResendConfirmEmail(string destinationEmail, string confirmEmailLink);
        bool SendPasswordResetEmail(string destinationEmail, string resetPasswordLink);
        bool SendChangeEmail (string destinationEmail, string changeEmailLink);
    }
}
