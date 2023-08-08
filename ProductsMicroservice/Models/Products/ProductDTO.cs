using ProductsMicroservice.Models.Categories;
using SharedResources.Models;

namespace ProductsMicroservice.Models.Products
{
    public class ProductDTO
    {
        public string Id { get; set; } = string.Empty;
        public List<Item<string, string>> Name { get; set; } = default!;
        public List<Item<string, string>> Description { get; set; } = default!;
        public string ProductUrl { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string StoreId { get; set; } = string.Empty;
        public List<string> PictureUrls { get; set; } = default!;
        public List<string> VideoUrls { get; set; } = default!;
        public List<ProductReview>? Reviews { get; set; }
        public List<Item<string, List<Item<string, string>>>> Tags { get; set; } = default!;
        public List<Item<string, List<Item<string, string>>>> CoverTags { get; set; } = default!;
        public List<BaseCategory> Categories { get; set; } = default!;
    }
}
