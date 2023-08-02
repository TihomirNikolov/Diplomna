using PaymentsMicroservice.Models.DTOs;

namespace PaymentsMicroservice.Interfaces
{
    public interface ICustomersService
    {
        Task AddCardAsync(string email, string cardNumber, string cardholderName, string month, string year, string cvv, string cardType);

        Task<List<CardDTO>> GetCustomersCardsAsync(string email);

        Task<bool> DeleteCustomersCardAsync(string email, string cardId);
    }
}
