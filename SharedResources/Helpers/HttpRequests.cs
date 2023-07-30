using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using SharedResources.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace SharedResources.Helpers
{
    public static class HttpRequests
    {
        public static async Task<string> GetUserEmailAsync(string token)
        {
            HttpClientHandler clientHandler = new HttpClientHandler();
            clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

            var httpClient = new HttpClient(clientHandler);

            var response = await httpClient.GetAsync("https://host.docker.internal:44318/api/authenticate/get-user-email/" + token);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var email = await response.Content.ReadAsStringAsync();

            return email;
        }

        public static async Task<List<ShoppingCartItemDTO>> GetShoppingCartItemsInformationAsync(List<string> productUrls)
        {
            HttpClientHandler clientHandler = new HttpClientHandler();
            clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

            var httpClient = new HttpClient(clientHandler);

            var json = JsonConvert.SerializeObject(productUrls);
            var content = new StringContent(json, Encoding.UTF8, "application/json") ;
            var response = await httpClient.PostAsync("https://host.docker.internal:44320/api/products/shoppingcart", content);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var shoppingCartItems = JsonConvert.DeserializeObject<List<ShoppingCartItemDTO>>(await response.Content.ReadAsStringAsync());

            return shoppingCartItems;
        }
    }
}
