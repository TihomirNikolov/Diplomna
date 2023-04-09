namespace AuthMicroservice.Authentication.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime TokenExpiryTime { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
