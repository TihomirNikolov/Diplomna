namespace UserMicroservice.Interfaces.Services
{
    public interface IHangfireService
    {
        void DeleteEmailVerification(string deleteEmailVerificationToken);
        void DeletePasswordVerification(string deletePasswordVerificationToken);
        void DeleteChangeEmailRequest(string deleteChangeEmailToken);
    }
}
