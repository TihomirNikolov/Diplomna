namespace UserMicroservice.Authentication.Models.Database
{
    public class HomeAddress
    {
        public int Id { get; set; }
        public string Region { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public Address AddressObject { get; set; } = default!;
    }
}
