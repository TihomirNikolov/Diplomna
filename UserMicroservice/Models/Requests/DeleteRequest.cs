namespace UserMicroservice.Models.Requests
{
    public class DeleteRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
