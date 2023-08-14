using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PaymentsMicroservice.Interfaces;
using PaymentsMicroservice.Models;
using PaymentsMicroservice.Models.Database;
using PaymentsMicroservice.Models.Requests;
using Stripe;

namespace PaymentsMicroservice.Services
{
    public class PaymentsService : IPaymentsService
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly ICustomersService _customersService;

        public PaymentsService(ApplicationDbContext dbContext,
                               ICustomersService customersService)
        {
            _dbContext = dbContext;
            _customersService = customersService;
        }

        public async Task<bool> CreatePaymentWithExistingCardAsync(string orderId, string cardId, string amount)
        {
            return await CreatePaymentAsync(orderId, cardId, amount);
        }

        public async Task<bool> CreatePaymentWithNewCardAsync(string orderId, string email, AddCardRequest newCard, string amount)
        {
            var cardId = await _customersService.AddCardAsync(email, newCard.CardNumber, newCard.CardholderName, newCard.Month, newCard.Year, newCard.CVV, newCard.CardType);

            if (string.IsNullOrEmpty(cardId))
                return false;

            return await CreatePaymentAsync(orderId, cardId, amount);
        }

        private async Task<bool> CreatePaymentAsync(string orderId, string cardId, string amount)
        {
            try
            {
                var card = _dbContext.Cards.Include(c => c.Customer).FirstOrDefault(c => c.Id == cardId);

                if (card == null)
                    return false;

                decimal.TryParse(amount, out var decimalAmount);

                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(decimalAmount * 100),
                    Currency = "BGN",
                    PaymentMethod = card.CardId,
                    Customer = card.Customer.CutomerId
                };

                var service = new PaymentIntentService();
                var result = service.Create(options);

                var payment = new Payment
                {
                    Amount = decimalAmount,
                    Card = card,
                    DateOfPayment = DateTime.Now,
                    OrderId = orderId,
                    PaymentId = result.Id
                };

                await _dbContext.Payments.AddAsync(payment);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
