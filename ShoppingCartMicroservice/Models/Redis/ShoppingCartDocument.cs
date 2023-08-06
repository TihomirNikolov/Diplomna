namespace ShoppingCartMicroservice.Models.Redis
{
    public class ShoppingCartDocument
    {
        public string ProductId { get; set; } = string.Empty;
        public int Number { get; set; }
    }
}
