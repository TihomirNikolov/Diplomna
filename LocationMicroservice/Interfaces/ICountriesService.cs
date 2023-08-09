using LocationMicroservice.Models.Database;
using LocationMicroservice.Models.Responses;

namespace LocationMicroservice.Interfaces
{
    public interface ICountriesService
    {
        Task<Country?> GetCountryByIpAddressAsync(string ipAddress);
        Task<Country?> GetCountryByCountryCodeAsync(string countryCode);
        Task<IpCountryNameLocations> GetCountryByIpAndCountryCodeAsync(string ipAddress, string countryCode);
    }
}
