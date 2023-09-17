using OrdersMicroservice.Models.Database;
using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Interfaces
{
    public interface IOrdersService
    {
        Task<string> CreateOrderAsync(string uniqueId, List<OrderItemDTO> orderItems, AddressDTO address, string comment, CardPaymentDTO cardPayment);

        Task<List<OrderDTO>> GetOrdersAsync(string id);

        Task<OrderWithItemsDTO?> GetOrderByIdAsync(string id);

        Task<List<OrderDTO>> GetOrdersByStatusAsync(OrderStatusEnum status);

        Task<List<OrderDTO>> GetNonFinishedOrdersAsync();

        Task<List<OrderCountDTO>> GetFinishedOrdersCountAsync(int year);

        Task<List<OrderDTO>> GetFinishedOrdersByMonthAsync(int year);

        Task UpdateOrderStatusAsync(string id, OrderStatusEnum status);
    }
}
