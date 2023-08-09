namespace ProductsMicroservice.Models.DTOs
{
    public class StoreProductDTO
    {
        public string ProductId { get; set; } = string.Empty;

        public string StoreId { get; set; } = string.Empty;

        public int Count { get; set; }
    }
}
