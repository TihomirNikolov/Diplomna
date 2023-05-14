namespace UserMicroservice.Models.Responses
{
    public class LoginResponse : TokenResponse
    {
        public bool IsEmailConfirmed { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }
}
