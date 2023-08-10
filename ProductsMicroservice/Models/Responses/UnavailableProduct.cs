namespace ProductsMicroservice.Models.Responses
{
    public class UnavailableProduct
    {
        public string ProductId { get; set; } = string.Empty;
        public int StoreCount { get; set; }
    }
}
