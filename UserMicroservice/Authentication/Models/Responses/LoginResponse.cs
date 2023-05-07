namespace UserMicroservice.Authentication.Models.Responses
{
    public class LoginResponse : TokenResponse
    {
        public bool IsEmailConfirmed { get; set; }
    }
}
