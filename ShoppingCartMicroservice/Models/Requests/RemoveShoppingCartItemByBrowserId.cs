namespace ShoppingCartMicroservice.Models.Requests
{
    public class RemoveShoppingCartItemByBrowserId : RemoveShoppingCartItemBase
    {
        public string BrowserId { get; set; } = string.Empty;
    }
}
