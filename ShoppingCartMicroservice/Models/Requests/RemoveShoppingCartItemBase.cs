namespace ShoppingCartMicroservice.Models.Requests
{
    public abstract class RemoveShoppingCartItemBase
    {
        public string ProductId { get; set; } = string.Empty;
    }
}
