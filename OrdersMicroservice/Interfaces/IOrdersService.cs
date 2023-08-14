using OrdersMicroservice.Models.Database;
using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Interfaces
{
    public interface IOrdersService
    {
        Task<string> CreateOrderAsync(string uniqueId, List<OrderItemDTO> orderItems, AddressDTO address, string comment, CardPaymentDTO cardPayment);

        Task<List<OrderDTO>> GetOrdersAsync(string id);
    }
}
