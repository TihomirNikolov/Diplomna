using AutoMapper;
using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.Products;

namespace ProductsMicroservice.Services
{
    public class ProductsService : BaseService, IProductsService
    {
        private IMapper _mapper;

        protected override string CollectionName => "Products";


        public ProductsService(IMongoClient mongoClient, IMapper mapper) : base(mongoClient)
        {
            _mapper = mapper;
        }


        public async Task<List<ProductDTO>> GetProductsAsync()
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var collection = await db.GetCollection<ProductDocument>(CollectionName).Find(Builders<ProductDocument>.Filter.Empty).ToListAsync();

            return _mapper.Map<List<ProductDocument>, List<ProductDTO>>(collection);
        }

        public async Task<bool> CreateProductAsync(Product product)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            await db.GetCollection<ProductDocument>(CollectionName).InsertOneAsync(_mapper.Map<Product, ProductDocument>(product));

            return true;
        }

        public async Task<List<CoverProductDTO>> GetCoverProductsAsync()
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var collection = await db.GetCollection<ProductDocument>(CollectionName).Find(Builders<ProductDocument>.Filter.Empty).ToListAsync();
            return _mapper.Map<List<ProductDocument>, List<CoverProductDTO>>(collection);
        }

        public async Task<List<CoverProductDTO>> GetCoverProductsByCategoryAsync(string categoryName)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var collection = await db.GetCollection<ProductDocument>(CollectionName)
                .Find(Builders<ProductDocument>.Filter.ElemMatch(c => c.Categories, c => c.DisplayName.ToLower() == categoryName.ToLower())).ToListAsync();

            return _mapper.Map<List<CoverProductDTO>>(collection);
        }
    }
}
