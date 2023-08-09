using ProductsMicroservice.Models.DTOs;

namespace ProductsMicroservice.Interfaces
{
    public interface IStoreProductService
    {
        Task<bool> AddProductToStoreAsync(string productId, string storeId, int count);

        Task<bool> BuyProductsFromStoreAsync(List<StoreProductDTO> storeProducts);

        Task<int> GetProductCountByStoreAsync(string storeId, string productId);
    }
}
