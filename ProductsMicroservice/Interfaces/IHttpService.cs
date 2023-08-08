using ProductsMicroservice.Models.Stores;

namespace ProductsMicroservice.Interfaces
{
    public interface IHttpService
    {
        Task<Location?> GetLocationByIpAddressAsync(string ipAddress);
    }
}
