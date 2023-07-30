namespace ShoppingCartMicroservice.Models.Redis
{
    public class ShoppingCartDocument
    {
        public string ProductUrl { get; set; } = string.Empty;
        public int Number { get; set; }
    }
}
