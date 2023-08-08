using LocationMicroservice.Interfaces;
using LocationMicroservice.Models.HttpResponses;
using Newtonsoft.Json;

namespace LocationMicroservice.Services
{
    public class HttpService : IHttpService
    {
        public async Task<GeoLocation?> GetInformationFromIpAddressAsync(string ipAddress)
        {
            var httpClient = new HttpClient();

            var response = await httpClient.GetAsync("https://api.iplocation.net/?ip=" + ipAddress);

            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            var geoLocation = JsonConvert.DeserializeObject<GeoLocation>(json);
            return geoLocation;
        }
    }
}
