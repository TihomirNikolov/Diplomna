using ProductsMicroservice.Models.Products;
using SharedResources.Models;

namespace ProductsMicroservice.Interfaces
{
    public interface IProductsService
    {
        Task<List<ProductDTO>> GetProductsAsync();
        Task<List<ProductDTO>> GetProductsByUrlsAsync(List<string> productUrls);
        Task<List<CoverProductDTO>> GetCoverProductsAsync();
        Task<List<CoverProductDTO>> GetCoverProductsByCategoryAsync(string categoryName);
        Task<bool> CreateProductAsync(Product product);
        Task<bool> CheckIfProductExistsAsync(string url);
        Task<ProductDTO> GetProductByUrlAsync(string url);
        Task<bool> AddReviewAsync(ProductReview review, string productUrl);
        Task<bool> RemoveReviewAsync(ProductReview review, string productUrl);
        Task<List<SearchProductDTO>> SearchByTextAsync (string searchText);
        Task<List<CoverProductDTO>> GetAllBySearchTextAsync(string searchText);
        Task<List<SearchProductDTO>> GetSearchProductsByUrls(List<string> urls);
        Task<List<ShoppingCartItemDTO>> GetShoppingCartItemsInformationAsync(List<string> ids);
    }
}
