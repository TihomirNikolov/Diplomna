using System.ComponentModel.DataAnnotations.Schema;

namespace UserMicroservice.Authentication.Models.Database
{
    public class ResetPasswordToken : BaseToken
    {
        public ResetPasswordToken() : base()
        {
        }
    }
}
