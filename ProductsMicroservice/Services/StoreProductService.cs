using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Responses;
using ProductsMicroservice.Models.Stores;

namespace ProductsMicroservice.Services
{
    public class StoreProductService : BaseService, IStoreProductService
    {
        protected override string CollectionName => "StoreProduct";

        public StoreProductService(IMongoClient mongoClient) : base(mongoClient)
        {
        }

        public async Task<bool> AddProductToStoreAsync(string productId, string storeId, int count)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var filter = Builders<StoreProductDocument>.Filter.Where(s => s.ProductId == productId && s.StoreId == storeId);

            var storeProduct = await db.GetCollection<StoreProductDocument>(CollectionName).Find(filter).SingleOrDefaultAsync();

            if (storeProduct == null)
            {
                await db.GetCollection<StoreProductDocument>(CollectionName)
                        .InsertOneAsync(new StoreProductDocument
                        {
                            ProductId = productId,
                            StoreId = storeId,
                            Count = count
                        });
            }
            else
            {
                var newCount = storeProduct.Count + count;
                var update = Builders<StoreProductDocument>.Update
                                    .Set(s => s.Count, newCount);

                await db.GetCollection<StoreProductDocument>(CollectionName).UpdateOneAsync(filter, update);
            }

            return true;
        }

        public async Task<bool> BuyProductsFromStoreAsync(List<StoreProductDTO> storeProducts)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            foreach (var storeProduct in storeProducts)
            {
                var filter = Builders<StoreProductDocument>.Filter.Where(s => s.ProductId == storeProduct.ProductId && s.StoreId == storeProduct.StoreId);

                var update = Builders<StoreProductDocument>.Update
                    .Inc(s => s.Count, storeProduct.Count * -1);

                await db.GetCollection<StoreProductDocument>(CollectionName).UpdateOneAsync(filter, update);
            }

            return true;
        }

        public async Task<StoreProductBase> GetProductInfoByStoreAsync(string storeId, string productId)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var filter = Builders<StoreProductDocument>.Filter.Where(s => s.ProductId == productId && s.StoreId == storeId);

            var storeProduct = await db.GetCollection<StoreProductDocument>(CollectionName).Find(filter).SingleOrDefaultAsync();

            return new StoreProductBase { Count = storeProduct.Count, Discount = storeProduct.Discount };
        }

        public async Task<bool> IsProductAvailableAsync(string productId)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var filter = Builders<StoreProductDocument>.Filter.Where(s => s.ProductId == productId);

            var product = await db.GetCollection<StoreProductDocument>(CollectionName).Find(filter).SingleOrDefaultAsync();

            return product != null;
        }

        public async Task<AreProductsAvailableResponse?> AreProductsAvailableAsync(List<StoreProductDTO> storeProducts)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var response = new AreProductsAvailableResponse();

            foreach (var product in storeProducts)
            {
                var filter = Builders<StoreProductDocument>.Filter.Where(s => s.ProductId == product.ProductId && s.StoreId == product.StoreId);

                var storeProduct = await db.GetCollection<StoreProductDocument>(CollectionName).Find(filter).SingleOrDefaultAsync();

                if (storeProduct == null)
                    return null;

                if (storeProduct.Count < product.Count)
                {
                    response.UnavailableProducts.Add(new UnavailableProduct { ProductId = storeProduct.ProductId, StoreCount = storeProduct.Count });
                }
            }
            response.IsSuccessful = response.UnavailableProducts.Count == 0;
            return response;
        }
    }
}
