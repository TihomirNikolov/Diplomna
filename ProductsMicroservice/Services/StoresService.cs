using AutoMapper;
using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Products;
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

            var storeProductFilter = Builders<StoreProductDocument>.Filter.Eq("ProductId", productId);
            var storeProducts = await db.GetCollection<StoreProductDocument>("StoreProduct").Find(storeProductFilter).ToListAsync();

            var storeIds = storeProducts.ConvertAll(sp => sp.StoreId);

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
    }
}
