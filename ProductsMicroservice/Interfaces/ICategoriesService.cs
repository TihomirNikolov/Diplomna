using MongoDB.Bson;
using ProductsMicroservice.Models.Categories;

namespace ProductsMicroservice.Interfaces
{
    public interface ICategoriesService
    {
        Task<List<Category>> GetCategoriesAsync();
        Task<List<CategoryDTO>> GetCategoriesWithSubcategoriesAsync();
        Task<CategoryDTO> GetSubCategoriesCategoryByUrl(string url);
        Task<bool> CreateCategoryAsync(Category category);
        Task<bool> UrlPathExists(string url);
        Task<List<SearchCategoryDTO>> GetCategoriesByUrlsAsync(List<string> urls);
    }
}
