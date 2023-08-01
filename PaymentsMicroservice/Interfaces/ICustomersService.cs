namespace PaymentsMicroservice.Interfaces
{
    public interface ICustomersService
    {
        Task AddCardAsync(string email, string cardNumber, string cardholderName, string month, string year, string cvv, string cardType);
    }
}
