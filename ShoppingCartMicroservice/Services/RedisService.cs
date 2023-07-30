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

        public async Task<List<ShoppingCartItem>> AddItemToShoppingCartByBrowserIdAsync(string browserId, string productUrl, int number)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            var items = await AddItemToShoppingCartAsync(url, productUrl, number);

            return items;
        }

        public async Task<List<ShoppingCartItem>> AddItemToShoppingCartByEmailAsync(string email, string productUrl, int number)
        {
            var url = $"shoppingcart/email:{email}";

            var items = await AddItemToShoppingCartAsync(url, productUrl, number);

            return items;
        }

        public async Task<List<ShoppingCartItem>> UpdateItemToShoppingCartByBrowserIdAsync(string browserId, string productUrl, int number)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            var items = await UpdateShoppingCartItemAsync(url, productUrl, number);

            return items;
        }

        public async Task<List<ShoppingCartItem>> UpdateItemToShoppingCartByEmailAsync(string email, string productUrl, int number)
        {
            var url = $"shoppingcart/email:{email}";

            var items = await UpdateShoppingCartItemAsync(url, productUrl, number);

            return items;
        }

        public async Task<List<ShoppingCartItem>> DeleteShoppingCartItemByBrowserIdAsync(string browserId, string productUrl)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            var items = await DeleteShoppingCartItemAsync(url, productUrl);

            return items;
        }

        public async Task<List<ShoppingCartItem>> DeleteShoppingCartItemByEmailAsync(string email, string productUrl)
        {
            var url = $"shoppingcart/email:{email}";

            var items = await DeleteShoppingCartItemAsync(url, productUrl);

            return items;
        }

        private async Task<List<ShoppingCartItem>> AddItemToShoppingCartAsync(string url, string productUrl, int number)
        {
            var db = _redis.GetDatabase();

            var shoppingCartItemDocuments = new List<ShoppingCartDocument>();

            if (await db.KeyExistsAsync(url))
            {
                shoppingCartItemDocuments = JsonConvert.DeserializeObject<List<ShoppingCartDocument>>(db.StringGet(url).ToString())!;
                var item = shoppingCartItemDocuments.FirstOrDefault(s => s.ProductUrl == productUrl);
                if (item != null)
                {
                    item.Number++;
                }
                else
                {
                    shoppingCartItemDocuments.Add(new ShoppingCartDocument { ProductUrl = productUrl, Number = number });
                }
            }
            else
            {
                shoppingCartItemDocuments.Add(
                    new ShoppingCartDocument { ProductUrl = productUrl, Number = number }
                );
            }

            await db.StringSetAsync(url, JsonConvert.SerializeObject(shoppingCartItemDocuments));

            var shoppingCartItems = await HttpRequests.GetShoppingCartItemsInformationAsync(shoppingCartItemDocuments.Select(s => s.ProductUrl).ToList());

            var mergedCollections = shoppingCartItemDocuments.Join(
                shoppingCartItems,
                itemA => itemA.ProductUrl,
                itemB => itemB.ProductUrl,
                (itemA, itemB) => new ShoppingCartItem
                {
                    ProductUrl = itemA.ProductUrl,
                    CoverTags = itemB.CoverTags,
                    ImageUrl = itemB.ImageUrl,
                    Name = itemB.Name,
                    Number = itemA.Number,
                    Price = itemB.Price
                }).ToList();

            return mergedCollections;
        }

        private async Task<List<ShoppingCartItem>> UpdateShoppingCartItemAsync(string url, string productUrl, int number)
        {
            var db = _redis.GetDatabase();

            var shoppingCartItemDocuments = new List<ShoppingCartDocument>();

            if (await db.KeyExistsAsync(url))
            {
                shoppingCartItemDocuments = JsonConvert.DeserializeObject<List<ShoppingCartDocument>>(db.StringGet(url).ToString())!;
                var modifyItem = shoppingCartItemDocuments.FirstOrDefault(s => s.ProductUrl == productUrl);

                if (modifyItem != null)
                {
                    modifyItem.Number = number;
                    await db.StringSetAsync(url, JsonConvert.SerializeObject(shoppingCartItemDocuments));
                }
            }

            var shoppingCartItems = await HttpRequests.GetShoppingCartItemsInformationAsync(shoppingCartItemDocuments.Select(s => s.ProductUrl).ToList());

            var mergedCollections = shoppingCartItemDocuments.Join(
                shoppingCartItems,
                itemA => itemA.ProductUrl,
                itemB => itemB.ProductUrl,
                (itemA, itemB) => new ShoppingCartItem
                {
                    ProductUrl = itemA.ProductUrl,
                    CoverTags = itemB.CoverTags,
                    ImageUrl = itemB.ImageUrl,
                    Name = itemB.Name,
                    Number = itemA.Number,
                    Price = itemB.Price
                }).ToList();

            return mergedCollections;
        }

        private async Task<List<ShoppingCartItem>> DeleteShoppingCartItemAsync(string url, string productUrl)
        {
            var db = _redis.GetDatabase();

            var shoppingCartItemDocuments = new List<ShoppingCartDocument>();

            if (await db.KeyExistsAsync(url))
            {
                shoppingCartItemDocuments = JsonConvert.DeserializeObject<List<ShoppingCartDocument>>(db.StringGet(url).ToString())!;
                var itemToDelete = shoppingCartItemDocuments.FirstOrDefault(s => s.ProductUrl == productUrl);
                if (itemToDelete != null)
                {
                    shoppingCartItemDocuments.Remove(itemToDelete);
                    await db.StringSetAsync(url, JsonConvert.SerializeObject(shoppingCartItemDocuments));
                }
            }

            var shoppingCartItems = await HttpRequests.GetShoppingCartItemsInformationAsync(shoppingCartItemDocuments.Select(s => s.ProductUrl).ToList());

            var mergedCollections = shoppingCartItemDocuments.Join(
                shoppingCartItems,
                itemA => itemA.ProductUrl,
                itemB => itemB.ProductUrl,
                (itemA, itemB) => new ShoppingCartItem
                {
                    ProductUrl = itemA.ProductUrl,
                    CoverTags = itemB.CoverTags,
                    ImageUrl = itemB.ImageUrl,
                    Name = itemB.Name,
                    Number = itemA.Number,
                    Price = itemB.Price
                }).ToList();

            return mergedCollections;
        }
    }
}
