namespace ProductsMicroservice.Models.Requests
{
    public class GetOrderItemsRequest
    {
        public List<string> ProductIds { get; set; } = default!;
    }
}
