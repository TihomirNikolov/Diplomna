using LocationMicroservice.Models.HttpResponses;

namespace LocationMicroservice.Interfaces
{
    public interface IHttpService
    {
        Task<GeoLocation?> GetInformationFromIpAddressAsync(string ipAddress);
    }
}
