using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Interfaces
{
    public interface IHttpService
    {
        Task<bool> CreatePaymentAsync(string orderId, string cardId, string amount);

        Task<bool> CreatePaymentWithNewCardAsync(string orderId, CardDTO newCard, string amount);
    }
}
