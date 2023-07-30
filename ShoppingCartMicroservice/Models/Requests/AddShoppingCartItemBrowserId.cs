namespace ShoppingCartMicroservice.Models.Requests
{
    public class AddShoppingCartItemBrowserId : AddShoppingCartItemBase
    {
        public string BrowserId { get; set; } = string.Empty;
    }
}
