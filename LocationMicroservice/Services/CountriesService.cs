using LocationMicroservice.Interfaces;
using LocationMicroservice.Models;
using LocationMicroservice.Models.Database;
using LocationMicroservice.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace LocationMicroservice.Services
{
    public class CountriesService : ICountriesService
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly IHttpService _httpService;

        public CountriesService(ApplicationDbContext dbContext,
                                IHttpService httpService) 
        {
            _dbContext = dbContext;
            _httpService = httpService;
        }

        public async Task<Country?> GetCountryByIpAddressAsync(string ipAddress)
        {
            var geoLocation = await _httpService.GetInformationFromIpAddressAsync(ipAddress);

            if(geoLocation == null)
            {
                return null;
            }

            var country = _dbContext.Countries.FirstOrDefault(c => c.Name.ToLower() == geoLocation.CountryName.ToLower());

            return country;
        }

        public async Task<Country?> GetCountryByCountryNameAsync(string countryName)
        {
            var country = await _dbContext.Countries.FirstOrDefaultAsync(c => c.Name.ToLower() == countryName);

            return country;
        }

        public async Task<IpCountryNameLocations> GetCountryByIpAndCountryNameAsync(string ipAddress, string countryName)
        {
            var countryByIp = await GetCountryByIpAddressAsync(ipAddress);

            var contryByName = await GetCountryByCountryNameAsync(countryName);

            return new IpCountryNameLocations
            {
                ContryByIp = countryByIp,
                CountryByName = contryByName
            };
        }
    }
}
