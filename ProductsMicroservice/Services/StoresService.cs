using AutoMapper;
using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Products;
using ProductsMicroservice.Models.Responses;
using ProductsMicroservice.Models.Stores;
using StackExchange.Redis;

namespace ProductsMicroservice.Services
{
    public class StoresService : BaseService, IStoresService
    {
        protected override string CollectionName => "Stores";

        private readonly IMapper _mapper;

        public StoresService(IMongoClient mongoClient,
                             IMapper mapper) : base(mongoClient)
        {
            _mapper = mapper;
        }

        public async Task<List<StoreDTO>> GetStoresAsync()
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var collection = await db.GetCollection<StoreDocument>(CollectionName).Find(Builders<StoreDocument>.Filter.Empty).ToListAsync();

            var mappedStores = _mapper.Map<List<StoreDocument>, List<StoreDTO>>(collection);

            return mappedStores;
        }

        public async Task<List<StoreDTO>> GetStoresByProductIdAsync(string productId)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var storeProductFilter = Builders<StoreDocument>.Filter.Where(s => s.Products.Any(p => p.ProductId == productId));
            var stores = await db.GetCollection<StoreDocument>(CollectionName).Find(storeProductFilter).ToListAsync();

            var storeIds = stores.ConvertAll(sp => sp.Id);

            var storeFilter = Builders<StoreDocument>.Filter.In("Id", storeIds);
            var storesContainingProduct = await db.GetCollection<StoreDocument>(CollectionName).Find(storeFilter).ToListAsync();

            return _mapper.Map<List<StoreDTO>>(storesContainingProduct);
        }

        public async Task<bool> CreateStoreAsync(Store store)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            await db.GetCollection<StoreDocument>(CollectionName).InsertOneAsync(_mapper.Map<Store, StoreDocument>(store));

            return true;
        }

        public async Task<bool> AddProductToStoreAsync(string productId, string storeId, int count)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var filter = Builders<StoreDocument>.Filter.Eq(s => s.Id, storeId);
            var store = await db.GetCollection<StoreDocument>(CollectionName).Find(filter).SingleOrDefaultAsync();
            var storeProduct = store.Products.FirstOrDefault(s => s.ProductId == productId);
            if (storeProduct == null)
            {
                var update = Builders<StoreDocument>.Update.Push(s => s.Products, new StoreProduct { ProductId = productId, Count = count });
                await db.GetCollection<StoreDocument>(CollectionName).FindOneAndUpdateAsync(filter, update);
            }
            else
            {
                var newCount = storeProduct.Count + count;
                var arrayFilter = Builders<StoreDocument>.Filter.Eq(s => s.Id, storeId)
                    & Builders<StoreDocument>.Filter.Eq("Products.ProductId", productId);
                var update = Builders<StoreDocument>.Update
                                    .Set("Products.$.Count", newCount);

                await db.GetCollection<StoreDocument>(CollectionName).UpdateOneAsync(arrayFilter, update);
            }

            return true;
        }

        public async Task<bool> BuyProductsFromStoreAsync(List<StoreProductDTO> storeProducts)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            foreach (var storeProduct in storeProducts)
            {
                var filter = Builders<StoreDocument>.Filter.Eq(s => s.Id, storeProduct.StoreId)
                     & Builders<StoreDocument>.Filter.Eq("Products.ProductId", storeProduct.ProductId);
                var update = Builders<StoreDocument>.Update
                    .Inc("Products.$.Count", storeProduct.Count * -1);

                await db.GetCollection<StoreDocument>(CollectionName).UpdateOneAsync(filter, update);
            }

            return true;
        }

        public async Task<StoreProductBase> GetProductInfoByStoreAsync(string storeId, string productId)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var filter = Builders<StoreDocument>.Filter.Where(s => s.Id == storeId);

            var store = await db.GetCollection<StoreDocument>(CollectionName).Find(filter).SingleOrDefaultAsync();

            var product = store.Products.FirstOrDefault(p => p.ProductId == productId);

            return new StoreProductBase { Count = product.Count, Discount = product.Discount };
        }

        public async Task<bool> IsProductAvailableAsync(string productId)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var filter = Builders<StoreDocument>.Filter.Empty;

            var stores = await db.GetCollection<StoreDocument>(CollectionName).Find(filter).ToListAsync();

            return stores.Any(s => s.Products.Any(p => p.ProductId == productId));
        }

        public async Task<AreProductsAvailableResponse?> AreProductsAvailableAsync(List<StoreProductDTO> storeProducts)
        {
            await CreateCollectionIfDoesntExistAsync();
            var db = GetDatabase();

            var response = new AreProductsAvailableResponse();

            foreach (var product in storeProducts)
            {
                var filter = Builders<StoreDocument>.Filter.Eq(s=> s.Id, product.StoreId);

                var stores = await db.GetCollection<StoreDocument>(CollectionName).Find(filter).ToListAsync();

                var storeProduct = stores.FirstOrDefault(s => s.Products.Any(p => p.ProductId == product.ProductId))?.Products.FirstOrDefault(p => p.ProductId == product.ProductId);

                if (storeProduct == null)
                    return null;

                if (storeProduct.Count < product.Count)
                {
                    if (response.UnavailableProducts == null)
                    {
                        response.UnavailableProducts = new List<UnavailableProduct>();
                    }
                    response.UnavailableProducts.Add(new UnavailableProduct { ProductId = storeProduct.ProductId, StoreCount = storeProduct.Count });
                }
            }
            response.IsSuccessful = response.UnavailableProducts == null || response.UnavailableProducts.Count == 0;
            return response;
        }
    }
}
