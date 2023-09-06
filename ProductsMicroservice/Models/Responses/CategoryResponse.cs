using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.Utilities;
using SharedResources.Models;

namespace ProductsMicroservice.Models.Responses
{
    public class CategoryResponse
    {
        public CategoryDTO Category { get; set; } = default!;

        public long NumberOfProducts { get; set; }

        public List<Item<List<Item<string, string>>, Filter>> Tags { get; set; } = default!;
    }
}
