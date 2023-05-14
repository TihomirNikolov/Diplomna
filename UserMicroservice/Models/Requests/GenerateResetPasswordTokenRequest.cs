namespace UserMicroservice.Models.Requests
{
    public class GenerateResetPasswordTokenRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}
