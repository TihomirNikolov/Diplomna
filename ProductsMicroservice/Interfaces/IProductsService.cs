using ProductsMicroservice.Models.Products;

namespace ProductsMicroservice.Interfaces
{
    public interface IProductsService
    {
        Task<List<ProductDTO>> GetProductsAsync();
        Task<List<ProductDTO>> GetProductsByUrlsAsync(List<string> productUrls);
        Task<List<CoverProductDTO>> GetCoverProductsAsync();
        Task<List<CoverProductDTO>> GetCoverProductsByCategoryAsync(string categoryName);
        Task<bool> CreateProductAsync(Product product);
        Task<bool> CheckIfProductExists(string url);
        Task<ProductDTO> GetProductByUrl(string url);
        Task<bool> AddReview(ProductReview review, string productUrl);
        Task<bool> RemoveReview(ProductReview review, string productUrl);
    }
}
