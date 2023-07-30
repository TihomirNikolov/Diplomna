namespace ShoppingCartMicroservice.Models.Requests
{
    public abstract class AddShoppingCartItemBase
    {
        public string ProductUrl { get; set; } = string.Empty;
        public int Number { get; set; }
    }
}
