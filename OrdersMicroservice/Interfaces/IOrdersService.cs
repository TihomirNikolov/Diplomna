using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Interfaces
{
    public interface IOrdersService
    {
        Task<string> CreateOrderAsync(string uniqueId, List<OrderItemDTO> orderItems, string comment);
    }
}
