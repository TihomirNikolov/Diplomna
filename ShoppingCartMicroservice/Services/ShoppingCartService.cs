using Newtonsoft.Json;
using SharedResources.Helpers;
using ShoppingCartMicroservice.Interfaces;
using ShoppingCartMicroservice.Models;
using ShoppingCartMicroservice.Models.Redis;
using StackExchange.Redis;

namespace ShoppingCartMicroservice.Services
{
    public class ShoppingCartService : IShoppingCartService
    {
        private readonly IConnectionMultiplexer _redis;

        public ShoppingCartService(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        public async Task<List<ShoppingCartItem>> GetShoppingCartByEmailAsync(string email)
        {
            var url = $"shoppingcart/email:{email}";

            var shoppingCartItems = await GetShoppingCartAsync(url);

            return shoppingCartItems;
        }

        public async Task<List<ShoppingCartItem>> GetShoppingCartByBrowserIdAsync(string browserId)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            var shoppingCartItems = await GetShoppingCartAsync(url);

            return shoppingCartItems;
        }

        private async Task<List<ShoppingCartItem>> GetShoppingCartAsync(string url)
        {
            var db = _redis.GetDatabase();

            if (!await db.KeyExistsAsync(url))
                return new List<ShoppingCartItem>();

            var shoppingCartDocuments = JsonConvert.DeserializeObject<List<ShoppingCartDocument>>(db.StringGet(url).ToString())!;

            var shoppingCartItems = await HttpRequests.GetShoppingCartItemsInformationAsync(shoppingCartDocuments.Select(s => s.ProductUrl).ToList());

            var mergedCollections = shoppingCartDocuments.Join(
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

        public async Task<List<ShoppingCartItem>> MergeShoppingCartsAsync(string email, string browserId)
        {
            var db = _redis.GetDatabase();

            var emailUrl = $"shoppingcart/email:{email}";
            var browserIdUrl = $"shoppingcart/browserId:{browserId}";

            var browserIdShoppingCartItemDocuments = new List<ShoppingCartDocument>();
            var emailShoppingCartItemDocuments = new List<ShoppingCartDocument>();

            if (await db.KeyExistsAsync(emailUrl))
            {
                emailShoppingCartItemDocuments = JsonConvert.DeserializeObject<List<ShoppingCartDocument>>(db.StringGet(emailUrl).ToString())!;
            }

            if (await db.KeyExistsAsync(browserIdUrl))
            {
                browserIdShoppingCartItemDocuments = JsonConvert.DeserializeObject<List<ShoppingCartDocument>>(db.StringGet(browserIdUrl).ToString())!;
                await db.KeyDeleteAsync(browserIdUrl);
            }

            if (emailShoppingCartItemDocuments.Count == 0)
            {
                emailShoppingCartItemDocuments = browserIdShoppingCartItemDocuments;
                await db.StringSetAsync(emailUrl, JsonConvert.SerializeObject(emailShoppingCartItemDocuments));
                return await GetShoppingCartItemsInformationAsync(emailShoppingCartItemDocuments);
            }

            if (browserIdShoppingCartItemDocuments.Count == 0)
            {
                await db.StringSetAsync(emailUrl, JsonConvert.SerializeObject(emailShoppingCartItemDocuments));
                return await GetShoppingCartItemsInformationAsync(emailShoppingCartItemDocuments);
            }

            foreach (var shoppingCartItem in browserIdShoppingCartItemDocuments)
            {
                var emailShoppingCartItem = emailShoppingCartItemDocuments.FirstOrDefault(s => s.ProductUrl == shoppingCartItem.ProductUrl);

                if (emailShoppingCartItem != null)
                {
                    emailShoppingCartItem.Number += shoppingCartItem.Number;
                }
                else
                {
                    emailShoppingCartItemDocuments.Add(shoppingCartItem);
                }
            }

            await db.StringSetAsync(emailUrl, JsonConvert.SerializeObject(emailShoppingCartItemDocuments));
            return await GetShoppingCartItemsInformationAsync(emailShoppingCartItemDocuments);
        }

        private async Task<List<ShoppingCartItem>> GetShoppingCartItemsInformationAsync(List<ShoppingCartDocument> shoppingCartDocuments)
        {
            var shoppingCartItems = await HttpRequests.GetShoppingCartItemsInformationAsync(shoppingCartDocuments.Select(s => s.ProductUrl).ToList());

            var mergedCollections = shoppingCartDocuments.Join(
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
