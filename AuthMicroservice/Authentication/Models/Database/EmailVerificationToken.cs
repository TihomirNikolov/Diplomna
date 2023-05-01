using System.ComponentModel.DataAnnotations.Schema;

namespace AuthMicroservice.Authentication.Models.Database
{
    public class EmailVerificationToken : BaseToken
    {
        public EmailVerificationToken() : base()
        {
        }
    }
}
