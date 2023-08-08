namespace ProductsMicroservice.Interfaces
{
    public interface IStoreProductService
    {
        Task<bool> AddProductToStoreAsync(string productId, string storeId, int count);
    }
}
