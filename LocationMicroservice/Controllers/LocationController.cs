using LocationMicroservice.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LocationMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ICountriesService _countriesService;

        public LocationController(ICountriesService countriesService) 
        {
            _countriesService = countriesService;
        }

        [HttpGet]
        [Route("location/ip/{ipAddress}")]
        public async Task<IActionResult> GetLocationByIpAddress(string ipAddress)
        {
            var result = await _countriesService.GetCountryByIpAddressAsync(ipAddress);

            if(result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet]
        [Route("location/country/{countryName}")]
        public async Task<IActionResult> GetLocationByCountryName(string countryName)
        {
            var result = await _countriesService.GetCountryByCountryNameAsync(countryName);

            if(result == null) 
                return NotFound();

            return Ok(result);
        }

        [HttpGet]
        [Route("location/{idAddress}/{countryName}")]
        public async Task<IActionResult> GetLocationsForIpAndCountryName(string ipAddress, string countryName)
        {
            var result = await _countriesService.GetCountryByIpAndCountryNameAsync(ipAddress, countryName);

            return Ok(result);
        }
    }
}
