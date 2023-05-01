namespace AuthMicroservice.Authentication.Models.Responses
{
    public class TokenResponse
    {
        public string? AccessToken { get; set; }

        public string? RefreshToken { get; set; }

        public bool IsEmailConfirmed { get; set; }
    }
}
