using AuthMicroservice.Database;
using AuthMicroservice.Interfaces.Services.Database;

namespace AuthMicroservice.Services.Database
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
    }
}
