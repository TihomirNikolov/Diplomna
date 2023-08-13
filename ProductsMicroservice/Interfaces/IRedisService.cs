using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Redis;

namespace ProductsMicroservice.Interfaces
{
    public interface IRedisService
    {
        Task VisitProductAsync(string productUrl);
        Task<ProductVisit> GetProductVisitsByUrlAsync(string url);
        Task<List<SearchProductDTO>> GetMostPopularProductsAsync();
        Task VisitCategoryAsync(string categoryUrl, string id, string idType);
        Task<List<SearchCategoryDTO>> GetMostPopularCategoriesAsync();
        Task<List<SearchCategoryWithProductsDTO>> GetUserCategoriesWithNewsestProductsAsync(string id, string idType);
    }
}
