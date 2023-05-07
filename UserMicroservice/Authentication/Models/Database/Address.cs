using UserMicroservice.Authentication.Enums;

namespace UserMicroservice.Authentication.Models.Database
{
    public class Address
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DeliveryMetodEnum DeliveryMethod { get; set; }
        public bool IsDefault { get; set; }
        public int? HomeAddressId { get; set; }
        public HomeAddress? HomeAddress { get; set; }
        public int? OfficeAddressId { get; set; }
        public OfficeAddress? OfficeAddress { get; set; }
        public string UserInfoId { get; set; } = string.Empty;
        public UserInfo UserInfo { get; set; } = default!;
    }
}
