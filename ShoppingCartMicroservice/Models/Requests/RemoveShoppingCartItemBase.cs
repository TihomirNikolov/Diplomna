namespace ShoppingCartMicroservice.Models.Requests
{
    public abstract class RemoveShoppingCartItemBase
    {
        public string ProductUrl { get; set; } = string.Empty;
    }
}
