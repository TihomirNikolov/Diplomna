using SharedResources.Models;

namespace ProductsMicroservice.Models.Products
{
    public class CoverProductDTO
    {
        public string Id { get; set; } = string.Empty;
        public List<Item<string, string>> Name { get; set; } = default!;
        public string CoverImageUrl { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; }
        public decimal Price { get; set; }
        public string StoreId { get; set; } = string.Empty;
        public List<Item<string, List<Item<string, string>>>> CoverTags { get; set; } = default!;
        public List<Item<string, List<Item<string, string>>>> Tags { get; set; } = default!;
        public decimal Rating { get; set; }
        public decimal Comments { get; set; }
        public int SoldAmount { get; set; }
    }
}
