using OrdersMicroservice.Models.Database;

namespace OrdersMicroservice.Models.Requests
{
    public class UpdateOrderStatusRequest
    {
        public string OrderId { get; set; } = string.Empty;

        public OrderStatusEnum OrderStatus { get; set; }
    }
}
