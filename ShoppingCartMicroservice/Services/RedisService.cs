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

        public async Task<List<ShoppingCartItem>> AddItemToShoppingCartByBrowserIdAsync(string browserId, string productId, int number)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            var items = await AddItemToShoppingCartAsync(url, productId, number);

            return items;
        }

        public async Task<List<ShoppingCartItem>> AddItemToShoppingCartByEmailAsync(string email, string productId, int number)
        {
            var url = $"shoppingcart/email:{email}";

            var items = await AddItemToShoppingCartAsync(url, productId, number);

            return items;
        }

        public async Task<List<ShoppingCartItem>> UpdateItemToShoppingCartByBrowserIdAsync(string browserId, string productId, int number)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            var items = await UpdateShoppingCartItemAsync(url, productId, number);

            return items;
        }

        public async Task<List<ShoppingCartItem>> UpdateItemToShoppingCartByEmailAsync(string email, string productId, int number)
        {
            var url = $"shoppingcart/email:{email}";

            var items = await UpdateShoppingCartItemAsync(url, productId, number);

            return items;
        }

        public async Task<List<ShoppingCartItem>> DeleteShoppingCartItemByBrowserIdAsync(string browserId, string productId)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            var items = await DeleteShoppingCartItemAsync(url, productId);

            return items;
        }

        public async Task<List<ShoppingCartItem>> DeleteShoppingCartItemByEmailAsync(string email, string productId)
        {
            var url = $"shoppingcart/email:{email}";

            var items = await DeleteShoppingCartItemAsync(url, productId);

            return items;
        }

        private async Task<List<ShoppingCartItem>> AddItemToShoppingCartAsync(string url, string productId, int number)
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

            var shoppingCartItems = await HttpRequests.GetShoppingCartItemsInformationAsync(shoppingCartItemDocuments.Select(s => s.ProductId).ToList());

            var mergedCollections = shoppingCartItemDocuments.Join(
                shoppingCartItems,
                itemA => itemA.ProductId,
                itemB => itemB.ProductId,
                (itemA, itemB) => new ShoppingCartItem
                {
                    ProductId = itemA.ProductId,
                    ProductUrl= itemB.ProductUrl,
                    CoverTags = itemB.CoverTags,
                    ImageUrl = itemB.ImageUrl,
                    Name = itemB.Name,
                    Number = itemA.Number,
                    Price = itemB.Price,
                    Discount = itemB.Discount,
                    DiscountedPrice = itemB.DiscountedPrice,
                    StoreId = itemB.StoreId
                }).ToList();

            return mergedCollections;
        }

        private async Task<List<ShoppingCartItem>> UpdateShoppingCartItemAsync(string url, string productId, int number)
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

            var shoppingCartItems = await HttpRequests.GetShoppingCartItemsInformationAsync(shoppingCartItemDocuments.Select(s => s.ProductId).ToList());

            var mergedCollections = shoppingCartItemDocuments.Join(
                shoppingCartItems,
                itemA => itemA.ProductId,
                itemB => itemB.ProductId,
                (itemA, itemB) => new ShoppingCartItem
                {
                    ProductId = itemA.ProductId,
                    ProductUrl= itemB.ProductUrl,
                    CoverTags = itemB.CoverTags,
                    ImageUrl = itemB.ImageUrl,
                    Name = itemB.Name,
                    Number = itemA.Number,
                    Price = itemB.Price,
                    Discount = itemB.Discount,
                    DiscountedPrice = itemB.DiscountedPrice,
                    StoreId = itemB.StoreId
                }).ToList();

            return mergedCollections;
        }

        private async Task<List<ShoppingCartItem>> DeleteShoppingCartItemAsync(string url, string productId)
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

            var shoppingCartItems = await HttpRequests.GetShoppingCartItemsInformationAsync(shoppingCartItemDocuments.Select(s => s.ProductId).ToList());

            var mergedCollections = shoppingCartItemDocuments.Join(
                shoppingCartItems,
                itemA => itemA.ProductId,
                itemB => itemB.ProductId,
                (itemA, itemB) => new ShoppingCartItem
                {
                    ProductId = itemA.ProductId,
                    ProductUrl = itemB.ProductUrl,
                    CoverTags = itemB.CoverTags,
                    ImageUrl = itemB.ImageUrl,
                    Name = itemB.Name,
                    Number = itemA.Number,
                    Price = itemB.Price,
                    Discount = itemB.Discount,
                    DiscountedPrice = itemB.DiscountedPrice,
                    StoreId = itemB.StoreId
                }).ToList();

            return mergedCollections;
        }

        public async Task<List<ShoppingCartItem>> DeleteShoppingCartByEmailAsync(string email)
        {
            var url = $"shoppingcart/email:{email}";

            var items = await DeleteShoppingCartAsync(url);

            return items;
        }

        public async Task<List<ShoppingCartItem>> DeleteShoppingCartByBrowserIdAsync(string browserId)
        {
            var url = $"shoppingcart/browserId:{browserId}";

            var items = await DeleteShoppingCartAsync(url);

            return items;
        }

        public async Task<List<ShoppingCartItem>> DeleteShoppingCartAsync(string url)
        {
            var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync(url))
            {
                await db.KeyDeleteAsync(url);
            }

            return new List<ShoppingCartItem>();
        }
    }
}
