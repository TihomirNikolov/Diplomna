namespace ShoppingCartMicroservice.Models.Requests
{
    public abstract class AddShoppingCartItemBase
    {
        public string ProductId { get; set; } = string.Empty;
        public int Number { get; set; }
    }
}
