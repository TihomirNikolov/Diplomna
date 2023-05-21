using ProductsMicroservice.Models.Categories;

namespace ProductsMicroservice.Models.Requests
{
    public class CreateCategoryRequest
    {
        public Category Category { get; set; } = default!;
    }
}
