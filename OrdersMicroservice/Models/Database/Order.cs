
namespace OrdersMicroservice.Models.Database
{
    public class Order
    {
        public string Id { get; set; }

        public string UniqueId { get; set; } = string.Empty;

        public string OrderSum { get; set; } = string.Empty;

        public string Comment { get; set; } = string.Empty;

        public OrderStatusEnum Status { get; set; }

        public List<OrderItem> OrderItems { get; set; } = default!;

        public Address Address { get; set; } = default!;

        public Order()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
