using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Stores;

namespace ProductsMicroservice.Interfaces
{
    public interface IStoreProductService
    {
        Task<bool> AddProductToStoreAsync(string productId, string storeId, int count);

        Task<bool> BuyProductsFromStoreAsync(List<StoreProductDTO> storeProducts);

        Task<StoreProductBase> GetProductInfoByStoreAsync(string storeId, string productId);

        Task<bool> IsProductAvailableAsync(string productId);
    }
}
