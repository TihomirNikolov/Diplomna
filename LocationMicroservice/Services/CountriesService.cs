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

            var country = _dbContext.Countries.FirstOrDefault(c => c.Code.ToLower() == geoLocation.CountryCode.ToLower());

            return country;
        }

        public async Task<Country?> GetCountryByCountryCodeAsync(string countryCode)
        {
            var country = await _dbContext.Countries.FirstOrDefaultAsync(c => c.Code.ToLower() == countryCode);

            return country;
        }

        public async Task<IpCountryNameLocations> GetCountryByIpAndCountryCodeAsync(string ipAddress, string countryCode)
        {
            var countryByIp = await GetCountryByIpAddressAsync(ipAddress);

            var contryByName = await GetCountryByCountryCodeAsync(countryCode);

            return new IpCountryNameLocations
            {
                ContryByIp = countryByIp,
                CountryByName = contryByName
            };
        }
    }
}
