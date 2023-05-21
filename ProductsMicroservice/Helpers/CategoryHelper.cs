using MongoDB.Driver;
using ProductsMicroservice.Models.Categories;

namespace ProductsMicroservice.Helpers
{
    public class CategoryHelper
    {
        private IMongoClient _client;

        public CategoryHelper(IMongoClient client)
        {
            _client = client;
        }

        public Dictionary<string, List<string>> GetCategoryTags(Category category)
        {
            return null;
        }
    }
}
