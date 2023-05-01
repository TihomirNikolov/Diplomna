namespace AuthMicroservice.Authentication.Models.Requests
{
    public class GenerateResetPasswordTokenRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}
