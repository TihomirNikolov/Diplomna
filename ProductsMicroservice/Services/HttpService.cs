using Newtonsoft.Json;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Stores;

namespace ProductsMicroservice.Services
{
    public class HttpService :IHttpService
    {
        public async Task<Location?> GetLocationByIpAddressAsync(string ipAddress)
        {
            var clientHandler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; }
            };

            var httpClient = new HttpClient(clientHandler);

            var response = await httpClient.GetAsync("https://host.docker.internal:44328/api/location/ip/" + ipAddress);

            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            var geoLocation = JsonConvert.DeserializeObject<Location>(json);
            return geoLocation;
        }
    }
}
