using ProductsMicroservice.Models.Stores;

namespace ProductsMicroservice.Interfaces
{
    public interface IStoresService
    {
        Task<List<StoreDTO>> GetStoresAsync();
        Task<List<StoreDTO>> GetStoresByProductIdAsync(string productId);
        Task<bool> CreateStoreAsync(Store store);
    }
}
