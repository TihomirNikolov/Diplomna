using ProductsMicroservice.Models.Categories;
using System.Collections.Generic;

namespace ProductsMicroservice.Models.Products
{
    public class Product
    {
        public Dictionary<string, string> Name { get; set; } = default!;
        public Dictionary<string, string> Description { get; set; } = default!;
        public string CoverImageUrl { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; }
        public Dictionary<string, Dictionary<string, string>> CoverTags { get; set; } = default!;
        public List<ProductReview>? Reviews { get; set; }
        public List<string> PictureUrls { get; set; } = default!;
        public List<string>? VideoUrls { get; set; }
        public Dictionary<string, Dictionary<string, string>> Tags { get; set; } = default!;
        public List<BaseCategory> Categories { get; set; } = default!;
    }
}
