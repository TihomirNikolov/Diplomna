using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.Products;
using ProductsMicroservice.Models.Redis;

namespace ProductsMicroservice.Interfaces
{
    public interface IRedisService
    {
        Task VisitProductAsync(string productUrl);
        Task<ProductVisit> GetProductVisitsByUrlAsync(string url);
        Task<List<SearchProductDTO>> GetMostPopularProductsAsync();
        Task VisitCategoryAsync(string categoryUrl);
        Task<List<SearchCategoryDTO>> GetMostPopularCategoriesAsync();
    }
}
