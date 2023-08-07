using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PaymentsMicroservice.Interfaces;
using PaymentsMicroservice.Models;
using PaymentsMicroservice.Models.DTOs;
using Stripe;

namespace PaymentsMicroservice.Services
{
    public class CustomersService : ICustomersService
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly IMapper _mapper;

        public CustomersService(ApplicationDbContext dbContext,
                                IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<string> AddCardAsync(string email, string cardNumber, string cardholderName, string month, string year, string cvv, string cardType)
        {
            try
            {
                //var options = new TokenCreateOptions
                //{
                //    Card = new TokenCardOptions
                //    {
                //        Number = cardNumber,
                //        Name= cardholderName,
                //        ExpMonth= month,
                //        ExpYear = year,
                //        Cvc= cvv
                //    }
                //};

                //var tokenService = new TokenService();

                //var cardTokenResponse = await tokenService.CreateAsync(options);

                var customer = _dbContext.Customers.FirstOrDefault(c => c.Email.ToLower() == email.ToLower());

                if (customer == null)
                {
                    customer = new Models.Database.Customer();

                    var customerOptions = new CustomerCreateOptions
                    {
                        Email = email
                    };

                    var customerService = new CustomerService();
                    var customerResponse = await customerService.CreateAsync(customerOptions);

                    customer.Email = customerResponse.Email;
                    customer.CutomerId = customerResponse.Id;
                    _dbContext.Customers.Add(customer);
                    await _dbContext.SaveChangesAsync();
                }

                var cardOptions = new CardCreateOptions
                {
                    Source = "tok_visa"
                };

                var cardService = new CardService();

                var cardResponse = await cardService.CreateAsync(customer.CutomerId, cardOptions);

                var entity = _dbContext.Cards.Add(new Models.Database.Card
                {
                    CardId = cardResponse.Id,
                    CustomerId = customer.Id,
                    Last4 = cardNumber[^4..],
                    Type = cardType
                });
                await _dbContext.SaveChangesAsync();

                return entity.Entity.Id;
            }
            catch (Exception ex)
            {
                return "";
            }

        }

        public async Task<List<CardDTO>> GetCustomersCardsAsync(string email)
        {
            var cards = await _dbContext.Cards.Include(c => c.Customer).Where(c => c.Customer.Email.ToLower() == email.ToLower()).ToListAsync();

            return _mapper.Map<List<CardDTO>>(cards);
        }

        public async Task<bool> DeleteCustomersCardAsync(string email, string cardId)
        {
            var card = await _dbContext.Cards.Include(c => c.Customer).FirstOrDefaultAsync(c => c.Id == cardId);

            if (card == null || card.Customer.Email.ToLower() != email.ToLower())
                return false;

            try
            {
                var cardService = new CardService();
                await cardService.DeleteAsync(card.Customer.CutomerId, card.CardId);

                _dbContext.Remove(card);
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
