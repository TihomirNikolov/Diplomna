using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Models.Requests
{
    public class AddOrderRequestBase
    {
        public List<OrderItemDTO> OrderItems { get; set; } = default!;

        public string Comment { get; set; } = string.Empty;
    }
}
