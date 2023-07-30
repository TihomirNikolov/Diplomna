﻿using AutoMapper;
using MongoDB.Bson;
using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.Products;
using SharedResources.Models;
using System.Linq;

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

        public async Task<List<ProductDTO>> GetProductsByUrlsAsync(List<string> productUrls)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var collection = await db.GetCollection<ProductDocument>(CollectionName)
                .Find(Builders<ProductDocument>.Filter.Where(p => productUrls.Contains(p.ProductUrl))).ToListAsync();

            return _mapper.Map<List<ProductDTO>>(collection);
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

            var mappedProducts = _mapper.Map<List<ProductDocument>, List<CoverProductDTO>>(collection);

            return mappedProducts;
        }

        public async Task<List<CoverProductDTO>> GetCoverProductsByCategoryAsync(string categoryName)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var collection = await db.GetCollection<ProductDocument>(CollectionName)
                .Find(Builders<ProductDocument>.Filter.ElemMatch(c => c.Categories, 
                c=> c.DisplayName.Any(name => name.Value == categoryName))).ToListAsync();

            return _mapper.Map<List<CoverProductDTO>>(collection);
        }

        public async Task<bool> CheckIfProductExistsAsync(string url)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var product = await db.GetCollection<ProductDocument>(CollectionName)
                .Find(Builders<ProductDocument>.Filter.Eq("ProductUrl", url)).FirstOrDefaultAsync();

            return product != null;
        }

        public async Task<ProductDTO> GetProductByUrlAsync(string url)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var product = await db.GetCollection<ProductDocument>(CollectionName)
                .Find(Builders<ProductDocument>.Filter.Eq("ProductUrl", url)).FirstOrDefaultAsync();

            return _mapper.Map<ProductDTO>(product);
        }

        public async Task<bool> AddReviewAsync(ProductReview review, string productUrl)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            review.Id = Guid.NewGuid().ToString();

            var filter = Builders<ProductDocument>.Filter.Eq(p => p.ProductUrl, productUrl);
            var update = Builders<ProductDocument>.Update.Push(p => p.Reviews, review);

            await db.GetCollection<ProductDocument>(CollectionName).FindOneAndUpdateAsync(filter, update);

            return true;
        }

        public async Task<bool> RemoveReviewAsync(ProductReview review, string productUrl)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filter = Builders<ProductDocument>.Filter.Where(p => p.ProductUrl == productUrl);
            var update = Builders<ProductDocument>.Update.PullFilter(p => p.Reviews, Builders<ProductReview>.Filter.Where(r => r.Id == review.Id));
            await db.GetCollection<ProductDocument>(CollectionName).UpdateOneAsync(filter, update);

            return true;
        }

        public async Task<List<SearchProductDTO>> SearchByTextAsync(string searchText)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filters = Builders<ProductDocument>.Filter.Or(
                Builders<ProductDocument>.Filter.ElemMatch(p => p.Name, name => name.Value.ToLower().Contains(searchText.ToLower())),
                Builders<ProductDocument>.Filter.ElemMatch(p => p.Description, desc => desc.Value.ToLower().Contains(searchText.ToLower())), 
                Builders<ProductDocument>.Filter.ElemMatch(p => p.Tags, tags => tags.Value.Any(t => t.Value.ToLower().Contains(searchText.ToLower())))
                );

            var productDocuments = (await db.GetCollection<ProductDocument>(CollectionName).Find(filters).SortBy(p => p.Name).ToListAsync()).Take(3).ToList();

            return _mapper.Map<List<SearchProductDTO>>(productDocuments);
        }

        public async Task<List<CoverProductDTO>> GetAllBySearchTextAsync(string searchText)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filters = Builders<ProductDocument>.Filter.Or(
                Builders<ProductDocument>.Filter.ElemMatch(p => p.Name, name => name.Value.ToLower().Contains(searchText.ToLower())),
                Builders<ProductDocument>.Filter.ElemMatch(p => p.Description, desc => desc.Value.ToLower().Contains(searchText.ToLower())),
                Builders<ProductDocument>.Filter.ElemMatch(p => p.Tags, tags => tags.Value.Any(t => t.Value.ToLower().Contains(searchText.ToLower())))
                );

            var productDocuments = await db.GetCollection<ProductDocument>(CollectionName).Find(filters).ToListAsync();

            return _mapper.Map<List<CoverProductDTO>>(productDocuments);
        }

        public async Task<List<SearchProductDTO>> GetSearchProductsByUrls(List<string> urls)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filter = Builders<ProductDocument>.Filter.Where(p => urls.Contains(p.ProductUrl));

            var productDocuments = await db.GetCollection<ProductDocument>(CollectionName).Find(filter).ToListAsync();

            return _mapper.Map<List<SearchProductDTO>>(productDocuments);
        }

        public async Task<List<ShoppingCartItemDTO>> GetShoppingCartItemsInformationAsync(List<string> urls)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filter = Builders<ProductDocument>.Filter.Where(p => urls.Contains(p.ProductUrl));

            var productDocuments = await db.GetCollection<ProductDocument>(CollectionName).Find(filter).ToListAsync();

            return _mapper.Map<List<ShoppingCartItemDTO>>(productDocuments);
        }
    }
}