using ProductsMicroservice.Models.Categories;

namespace ProductsMicroservice.Models.Products
{
    public class ProductDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public List<string> PictureUrls { get; set; } = default!;
        public List<string> VideoUrls { get; set; } = default!;
        public List<ProductReview> Reviews { get; set; } = default!;
        public Dictionary<string, string> Tags { get; set; } = default!;
        public List<BaseCategory> Categories { get; set; } = default!;
    }
}
