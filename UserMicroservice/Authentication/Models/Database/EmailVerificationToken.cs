using System.ComponentModel.DataAnnotations.Schema;

namespace UserMicroservice.Authentication.Models.Database
{
    public class EmailVerificationToken : BaseToken
    {
        public EmailVerificationToken() : base()
        {
        }
    }
}
