namespace OrdersMicroservice.Models.HttpRequests
{
    public class GetOrderItemsRequest
    {
        public List<string> ProductIds { get; set; } = default!;
    }
}
