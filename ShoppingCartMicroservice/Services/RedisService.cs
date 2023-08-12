using Newtonsoft.Json;
using SharedResources.Helpers;
using ShoppingCartMicroservice.Interfaces;
using ShoppingCartMicroservice.Models;
using ShoppingCartMicroservice.Models.Redis;
using StackExchange.Redis;

namespace ShoppingCartMicroservice.Services
{
    public class RedisService : IRedisService
    {
        private readonly IConnectionMultiplexer _redis;

        public RedisService(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        public async Task AddItemToShoppingCartByBrowserIdAsync(string browserId, string productId, int number)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            await AddItemToShoppingCartAsync(url, productId, number);
        }

        public async Task AddItemToShoppingCartByEmailAsync(string email, string productId, int number)
        {
            var url = $"shoppingcart/email:{email}";

            await AddItemToShoppingCartAsync(url, productId, number);
        }

        public async Task UpdateItemToShoppingCartByBrowserIdAsync(string browserId, string productId, int number)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            await UpdateShoppingCartItemAsync(url, productId, number);
        }

        public async Task UpdateItemToShoppingCartByEmailAsync(string email, string productId, int number)
        {
            var url = $"shoppingcart/email:{email}";

            await UpdateShoppingCartItemAsync(url, productId, number);
        }

        public async Task RemoveShoppingCartItemByBrowserIdAsync(string browserId, string productId)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            await DeleteShoppingCartItemAsync(url, productId);
        }

        public async Task RemoveShoppingCartItemByEmailAsync(string email, string productId)
        {
            var url = $"shoppingcart/email:{email}";

            await DeleteShoppingCartItemAsync(url, productId);
        }

        private async Task AddItemToShoppingCartAsync(string url, string productId, int number)
        {
            var db = _redis.GetDatabase();

            var shoppingCartItemDocuments = new List<ShoppingCartDocument>();

            if (await db.KeyExistsAsync(url))
            {
                shoppingCartItemDocuments = JsonConvert.DeserializeObject<List<ShoppingCartDocument>>(db.StringGet(url).ToString())!;
                var item = shoppingCartItemDocuments.FirstOrDefault(s => s.ProductId == productId);
                if (item != null)
                {
                    item.Number++;
                }
                else
                {
                    shoppingCartItemDocuments.Add(new ShoppingCartDocument { ProductId = productId, Number = number });
                }
            }
            else
            {
                shoppingCartItemDocuments.Add(
                    new ShoppingCartDocument { ProductId = productId, Number = number }
                );
            }

            await db.StringSetAsync(url, JsonConvert.SerializeObject(shoppingCartItemDocuments));
        }

        private async Task UpdateShoppingCartItemAsync(string url, string productId, int number)
        {
            var db = _redis.GetDatabase();

            var shoppingCartItemDocuments = new List<ShoppingCartDocument>();

            if (await db.KeyExistsAsync(url))
            {
                shoppingCartItemDocuments = JsonConvert.DeserializeObject<List<ShoppingCartDocument>>(db.StringGet(url).ToString())!;
                var modifyItem = shoppingCartItemDocuments.FirstOrDefault(s => s.ProductId == productId);

                if (modifyItem != null)
                {
                    modifyItem.Number = number;
                    await db.StringSetAsync(url, JsonConvert.SerializeObject(shoppingCartItemDocuments));
                }
            }
        }

        private async Task DeleteShoppingCartItemAsync(string url, string productId)
        {
            var db = _redis.GetDatabase();

            var shoppingCartItemDocuments = new List<ShoppingCartDocument>();

            if (await db.KeyExistsAsync(url))
            {
                shoppingCartItemDocuments = JsonConvert.DeserializeObject<List<ShoppingCartDocument>>(db.StringGet(url).ToString())!;
                var itemToDelete = shoppingCartItemDocuments.FirstOrDefault(s => s.ProductId == productId);
                if (itemToDelete != null)
                {
                    shoppingCartItemDocuments.Remove(itemToDelete);
                    await db.StringSetAsync(url, JsonConvert.SerializeObject(shoppingCartItemDocuments));
                }
            }
        }

        public async Task DeleteShoppingCartByEmailAsync(string email)
        {
            var url = $"shoppingcart/email:{email}";

            await DeleteShoppingCartAsync(url);
        }

        public async Task DeleteShoppingCartByBrowserIdAsync(string browserId)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            await DeleteShoppingCartAsync(url);
        }

        public async Task DeleteShoppingCartAsync(string url)
        {
            var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync(url))
            {
                await db.KeyDeleteAsync(url);
            }
        }
    }
}
