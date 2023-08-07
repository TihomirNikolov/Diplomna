using PaymentsMicroservice.Models.Requests;

namespace PaymentsMicroservice.Interfaces
{
    public interface IPaymentsService
    {
        Task<bool> CreatePaymentWithExistingCardAsync(string orderId, string cardId, string amount);

        Task<bool> CreatePaymentWithNewCardAsync(string orderId, string email, AddCardRequest newCard, string amount);
    }
}
