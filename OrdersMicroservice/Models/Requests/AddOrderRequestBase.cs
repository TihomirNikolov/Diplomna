using OrdersMicroservice.Models.Database;
using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Models.Requests
{
    public class AddOrderRequestBase
    {
        public List<OrderItemDTO> OrderItems { get; set; } = default!;

        public string Comment { get; set; } = string.Empty;

        public AddressDTO Address { get; set; } = default!;

        public CardPaymentDTO CardPayment { get; set; } = default!;
    }
}
