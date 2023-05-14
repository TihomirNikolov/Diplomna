using System.ComponentModel.DataAnnotations.Schema;

namespace UserMicroservice.Models.Database
{
    public class EmailVerificationToken : BaseToken
    {
        public EmailVerificationToken() : base()
        {
        }
    }
}
