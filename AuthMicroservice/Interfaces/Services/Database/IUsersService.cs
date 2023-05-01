namespace AuthMicroservice.Interfaces.Services.Database
{
    public interface IUsersService
    {
        void DeleteEmailVerification(string deleteEmailVerificationToken);
        void DeletePasswordVerification(string deletePasswordVerificationToken);
    }
}
