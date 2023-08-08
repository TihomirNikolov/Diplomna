using Newtonsoft.Json;

namespace LocationMicroservice.Models.HttpResponses
{
    public class GeoLocation
    {
        public string Ip { get; set; } = string.Empty;

        [JsonProperty("ip_number")]
        public string IpNumber { get; set; } = string.Empty;

        [JsonProperty("ip_version")]
        public string IpVersion { get; set; } = string.Empty;

        [JsonProperty("country_name")]
        public string CountryName { get; set; } = string.Empty;

        [JsonProperty("country_code2")]
        public string CountryCode { get; set; } = string.Empty;

        [JsonProperty("isp")]
        public string ISP { get; set; } = string.Empty;

        [JsonProperty("response_code")]
        public string ResponseCode { get; set; } = string.Empty;

        [JsonProperty("response_message")]
        public string ResponseMessage { get; set; } = string.Empty;
    }
}
