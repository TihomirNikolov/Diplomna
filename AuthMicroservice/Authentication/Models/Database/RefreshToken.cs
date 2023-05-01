using System.ComponentModel.DataAnnotations.Schema;

namespace AuthMicroservice.Authentication.Models.Database
{
    public class RefreshToken : BaseToken
    {
        public string DeviceType { get; set; } = string.Empty;

        public RefreshToken() : base()
        {
        }
    }
}
