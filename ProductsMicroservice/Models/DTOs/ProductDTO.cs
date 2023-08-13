using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.Products;
using SharedResources.Models;

namespace ProductsMicroservice.Models.DTOs
{
    public class ProductDTO : ProductDTOBase
    {
        public List<Item<string, string>> Description { get; set; } = default!;
        public List<string> PictureUrls { get; set; } = default!;
        public List<string> VideoUrls { get; set; } = default!;
        public List<ProductReview>? Reviews { get; set; }
        public List<Item<string, List<Item<string, string>>>> Tags { get; set; } = default!;
        public List<BaseCategory> Categories { get; set; } = default!;
    }
}
