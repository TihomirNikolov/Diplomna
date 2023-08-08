namespace ProductsMicroservice.Models.Stores
{
    public class StoreProduct
    {
        public string StoreId { get; set; } = string.Empty;

        public string ProductId { get; set; } = string.Empty;

        public int Count { get; set; }
    }
}
