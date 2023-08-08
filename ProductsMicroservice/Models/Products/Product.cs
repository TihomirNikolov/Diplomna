using ProductsMicroservice.Models.Categories;
using SharedResources.Models;
using System.Collections.Generic;

namespace ProductsMicroservice.Models.Products
{
    public class Product
    {
        public List<Item<string, string>> Name { get; set; } = default!;
        public List<Item<string, string>> Description { get; set; } = default!;
        public string CoverImageUrl { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; }
        public decimal Price { get; set; }
        public List<Item<string, List<Item<string, string>>>> CoverTags { get; set; } = default!;
        public List<ProductReview>? Reviews { get; set; }
        public List<string> PictureUrls { get; set; } = default!;
        public List<string>? VideoUrls { get; set; }
        public List<Item<string, List<Item<string, string>>>> Tags { get; set; } = default!;
        public List<BaseCategory> Categories { get; set; } = default!;
    }
}
