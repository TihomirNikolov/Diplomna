using ProductsMicroservice.Models.Products;

namespace ProductsMicroservice.Interfaces
{
    public interface IProductsService
    {
        Task<List<ProductDTO>> GetProductsAsync();
        Task<List<CoverProductDTO>> GetCoverProductsAsync();
        Task<List<CoverProductDTO>> GetCoverProductsByCategoryAsync(string categoryName);
        Task<bool> CreateProductAsync(Product product);
    }
}
