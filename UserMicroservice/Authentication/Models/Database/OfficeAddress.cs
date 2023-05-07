namespace UserMicroservice.Authentication.Models.Database
{
    public class OfficeAddress
    {
        public int Id { get; set; }
        public string Region { get; set; } = string.Empty;
        public string Office { get; set; } = string.Empty;
        public Address Address { get; set; } = default!;
    }
}
