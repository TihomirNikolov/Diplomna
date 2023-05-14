using System.ComponentModel.DataAnnotations.Schema;

namespace UserMicroservice.Models.Database
{
    public class RefreshToken : BaseToken
    {
        public string DeviceType { get; set; } = string.Empty;

        public RefreshToken() : base()
        {
        }
    }
}
