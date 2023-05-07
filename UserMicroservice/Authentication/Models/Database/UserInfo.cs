namespace UserMicroservice.Authentication.Models.Database
{
    public class UserInfo
    {
        public string Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public List<Address>? Addresses { get; set; }
        public ApplicationUser User { get; set; } = default!;
        public UserInfo()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
