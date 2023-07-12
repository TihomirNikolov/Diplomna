using Microsoft.EntityFrameworkCore;
using UserMicroservice.Interfaces.Services;
using UserMicroservice.Models;

namespace UserMicroservice.Services
{
    public class HangfireService : IHangfireService
    {
        private ApplicationDbContext _dbContext;

        public HangfireService(ApplicationDbContext dbContext) 
        { 
            _dbContext= dbContext;
        }

        public void DeleteEmailVerification(string deleteEmailVerificationToken)
        {
            var emailVerification = _dbContext.EmailVerificationsTokens.FirstOrDefault(e => e.Token == deleteEmailVerificationToken);
            if (emailVerification != null)
            {
                _dbContext.EmailVerificationsTokens.Remove(emailVerification);
                _dbContext.SaveChanges();
            }
        }
        public void DeletePasswordVerification(string deletePasswordVerificationToken)
        {
            var resetpasswordVerification = _dbContext.ResetPasswordTokens.FirstOrDefault(e => e.Token == deletePasswordVerificationToken);
            if (resetpasswordVerification != null)
            {
                _dbContext.ResetPasswordTokens.Remove(resetpasswordVerification);
                _dbContext.SaveChanges();
            }
        }

        public void DeleteChangeEmailRequest(string deleteChangeEmailToken)
        {
            var changeEmailToken = _dbContext.ChangeEmailTokens.FirstOrDefault(e => e.Token == deleteChangeEmailToken);
            if (changeEmailToken != null)
            {
                _dbContext.ChangeEmailTokens.Remove(changeEmailToken);
                _dbContext.SaveChanges();
            }
        }
    }
}
