using Newtonsoft.Json;
using OrdersMicroservice.Interfaces;
using OrdersMicroservice.Models.DTOs;
using OrdersMicroservice.Models.HttpRequests;
using System.Text;

namespace OrdersMicroservice.Services
{
    public class HttpService : IHttpService
    {
        public async Task<bool> CreatePaymentAsync(string orderId, string cardId, string amount)
        {
            var clientHandler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; }
            };

            var httpClient = new HttpClient(clientHandler);

            var cardPayment = new CreatePaymentExistingCardRequest
            {
                OrderId = orderId,
                CardId = cardId,
                Amount = amount
            };

            var json = JsonConvert.SerializeObject(cardPayment);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync("https://host.docker.internal:44322/api/payments/create/existing-card", content);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> CreatePaymentWithNewCardAsync(string orderId, CardDTO newCard, string amount)
        {
            var clientHandler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; }
            };

            var httpClient = new HttpClient(clientHandler);

            var cardPayment = new CreatePaymentNewCardRequest
            {
                OrderId = orderId,
                NewCard = newCard,
                Amount = amount
            };

            var json = JsonConvert.SerializeObject(cardPayment);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync("https://host.docker.internal:44322/api/payments/create/new-card", content);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }

            return false;
        }
    }
}
