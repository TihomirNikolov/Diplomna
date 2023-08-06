namespace OrdersMicroservice.Models.Requests
{
    public class AddOrderByBrowserIdRequest : AddOrderRequestBase
    {
        public string BrowserId { get; set; } = string.Empty;
    }
}
