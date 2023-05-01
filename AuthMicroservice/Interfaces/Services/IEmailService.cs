namespace AuthMicroservice.Interfaces.Services
{
    public interface IEmailService
    {
        bool SendConfirmEmail(string destinationEmail, string confirmEmailLink);
        bool SendPasswordResetEmail(string destinationEmail, string resetPasswordLink);
    }
}
