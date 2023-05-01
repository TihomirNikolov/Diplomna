using System.ComponentModel.DataAnnotations.Schema;

namespace AuthMicroservice.Authentication.Models.Database
{
    public class ResetPasswordToken : BaseToken
    {
        public ResetPasswordToken() : base()
        {
        }
    }
}
