using PaymentsMicroservice.Interfaces;
using PaymentsMicroservice.Models;
using Stripe;

namespace PaymentsMicroservice.Services
{
    public class CustomersService : ICustomersService
    {
        private readonly ApplicationDbContext _dbContext;

        public CustomersService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext; 
        }

        public async Task AddCardAsync(string email, string cardNumber, string cardholderName, string month, string year, string cvv, string cardType)
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
                        Email= email
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

                _dbContext.Cards.Add(new Models.Database.Card
                {
                    CardId = cardResponse.Id,
                    CustomerId = customer.Id,
                    Last4 = cardNumber[^4..]
                });
                await _dbContext.SaveChangesAsync();
            }
            catch(Exception ex)
            {

            }

        }
    }
}
