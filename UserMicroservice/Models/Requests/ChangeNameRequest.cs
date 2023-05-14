namespace UserMicroservice.Models.Requests
{
    public class ChangeNameRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}
