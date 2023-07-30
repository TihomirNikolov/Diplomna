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

        public async Task<List<Models.ShoppingCartItem>> GetShoppingCartByEmailAsync(string email)
        {
            var db = _redis.GetDatabase();
            var url = $"shoppingcart/email:{email}";

            if (!await db.KeyExistsAsync(url))
                return null;

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

        public async Task<List<Models.ShoppingCartItem>> GetShoppingCartByBrowserIdAsync(string browserId)
        {
            var db = _redis.GetDatabase();
            var url = $"shoppingcart/browserId:{browserId}";

            if (!await db.KeyExistsAsync(url))
                return null;

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
    }
}
