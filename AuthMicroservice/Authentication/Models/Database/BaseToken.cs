using System.ComponentModel.DataAnnotations.Schema;

namespace AuthMicroservice.Authentication.Models.Database
{
    public abstract class BaseToken
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime TokenExpiryTime { get; set; }
        public DateTime CreatedTime { get; set; }
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = default!;

        protected BaseToken()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
