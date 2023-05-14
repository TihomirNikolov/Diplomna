using UserMicroservice.Interfaces.Services.Database;
using UserMicroservice.Models;

namespace UserMicroservice.Services.Database
{
    public class UsersService : IUsersService
    {
        private readonly ApplicationDbContext _context;

        public UsersService(ApplicationDbContext context)
        {
            _context = context;
        }

        public void DeleteEmailVerification(string deleteEmailVerificationToken)
        {
            var emailVerification = _context.EmailVerificationsTokens.FirstOrDefault(e => e.Token == deleteEmailVerificationToken);
            if (emailVerification != null)
            {
                _context.EmailVerificationsTokens.Remove(emailVerification);
                _context.SaveChanges();
            }
        }
        public void DeletePasswordVerification(string deletePasswordVerificationToken)
        {
            var resetpasswordVerification = _context.ResetPasswordTokens.FirstOrDefault(e => e.Token == deletePasswordVerificationToken);
            if (resetpasswordVerification != null)
            {
                _context.ResetPasswordTokens.Remove(resetpasswordVerification);
                _context.SaveChanges();
            }
        }

        public void DeleteChangeEmailRequest(string deleteChangeEmailToken)
        {
            var changeEmailToken = _context.ChangeEmailTokens.FirstOrDefault(e => e.Token == deleteChangeEmailToken);
            if(changeEmailToken != null)
            {
                _context.ChangeEmailTokens.Remove(changeEmailToken);
                _context.SaveChanges();
            }
        }
    }
}
