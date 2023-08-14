using OrdersMicroservice.Models.Database;

namespace OrdersMicroservice.Models.DTOs
{
    public class OrderDTO
    {
        public string Id { get; set; } = string.Empty;

        public string UniqueId { get; set; } = string.Empty;

        public string OrderSum { get; set; } = string.Empty;

        public OrderStatusEnum Status { get; set; }

        public DateTime OrderDate { get; set; }
    }
}
