using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Products;
using ProductsMicroservice.Models.Responses;
using ProductsMicroservice.Models.Utilities;
using SharedResources.Models;

namespace ProductsMicroservice.Interfaces
{
    public interface IProductsService
    {
        Task<long> GetProductCountByCategoryUrlAsync(string categoryUrl);
        Task<List<ProductDTO>> GetProductsAsync();
        Task<List<ProductDTO>> GetProductsByUrlsAsync(List<string> productUrls);
        Task<List<CoverProductDTO>> GetCoverProductsAsync();
        Task<List<CoverProductDTO>> GetCoverProductsByCategoryAsync(string categoryName);
        Task<CoverProductsResponse> GetCoverProductsByCategoryPageAndItemsAsync(string categoryName, int pageNumber, 
                                                                                int itemsPerPage,
                                                                                List<CheckedFilter> filters, string sortingType);
        Task<List<Item<List<Item<string, string>>, Filter>>> GetTagsAsync(CategoryDTO category);
        Task<bool> CreateProductAsync(Product product);
        Task<bool> CheckIfProductExistsAsync(string url);
        Task<ProductDTO> GetProductByUrlAsync(string url);
        Task<bool> AddReviewAsync(ProductReview review, string productUrl);
        Task<bool> RemoveReviewAsync(ProductReview review, string productUrl);
        Task<List<SearchProductDTO>> SearchByTextAsync (string searchText);
        Task<List<CoverProductDTO>> GetAllBySearchTextAsync(string searchText, int pageNumber,
                                                            int itemsPerPage, string sortingType);
        Task<List<SearchProductDTO>> GetSearchProductsByUrls(List<string> urls);
        Task<List<ShoppingCartItemDTO>> GetShoppingCartItemsInformationAsync(List<string> ids);
        Task<List<OrderItemDTO>> GetOrderItemsInformationAsync(List<string> ids);
        Task AddProductsToCategoryAsync(List<SearchCategoryWithProductsDTO> categories);
        Task SeedProductsAsync(List<Product> products);
    }
}
