namespace ProductsMicroservice.Models.Stores
{
    public class StoreProduct : StoreProductBase
    {
        public string StoreId { get; set; } = string.Empty;

        public string ProductId { get; set; } = string.Empty;
    }
}
