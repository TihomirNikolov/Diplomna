using LocationMicroservice.Models.Database;

namespace LocationMicroservice.Models.Responses
{
    public class IpCountryNameLocations
    {
        public Country? ContryByIp { get; set; } = default!;

        public Country? CountryByName { get; set; } = default!;
    }
}
