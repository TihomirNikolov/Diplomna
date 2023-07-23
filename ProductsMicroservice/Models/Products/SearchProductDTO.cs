namespace ProductsMicroservice.Models.Products
{
    public class SearchProductDTO
    {
        public List<Item<string, string>> Name { get; set; } = default!;
        public List<Item<string, string>> Description { get; set; } = default!;
        public string CoverImageUrl { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
        public List<Item<string, List<Item<string, string>>>> CoverTags { get; set; } = default!;
        public decimal Price { get; set; } = decimal.Zero;
    }
}
