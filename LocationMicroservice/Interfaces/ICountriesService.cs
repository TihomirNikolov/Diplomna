using LocationMicroservice.Models.Database;
using LocationMicroservice.Models.Responses;

namespace LocationMicroservice.Interfaces
{
    public interface ICountriesService
    {
        Task<Country?> GetCountryByIpAddressAsync(string ipAddress);
        Task<Country?> GetCountryByCountryNameAsync(string countryName);
        Task<IpCountryNameLocations> GetCountryByIpAndCountryNameAsync(string ipAddress, string countryName);
    }
}
