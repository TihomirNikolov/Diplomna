namespace ProductsMicroservice.Models.Products
{
    public class CoverProductDTO
    {
        public Dictionary<string, string> Name { get; set; } = default!;
        public string CoverImageUrl { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; }
        public decimal Price { get; set; }
        public Dictionary<string, Dictionary<string, string>> CoverTags { get; set; } = default!;
        public Dictionary<string, Dictionary<string, string>> Tags { get; set; } = default!;
        public decimal Rating { get; set; }
        public decimal Comments { get; set; }
        public int SoldAmount { get; set; }
    }
}
