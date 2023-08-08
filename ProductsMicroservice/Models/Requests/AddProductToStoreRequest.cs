namespace ProductsMicroservice.Models.Requests
{
    public class AddProductToStoreRequest
    {
        public string ProductId { get; set; } = string.Empty;

        public string StoreId { get; set; } = string.Empty;

        public int Count { get; set; }
    }
}
