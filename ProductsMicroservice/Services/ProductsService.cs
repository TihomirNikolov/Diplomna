using AutoMapper;
using MongoDB.Driver;
using ProductsMicroservice.Helpers;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Products;
using SharedResources.Models;

namespace ProductsMicroservice.Services
{
    public class ProductsService : BaseService, IProductsService
    {
        private readonly IHttpService _httpService;
        private readonly IStoresService _storesService;
        private readonly IStoreProductService _storeProductService;

        private readonly IMapper _mapper;

        private readonly IHttpContextAccessor _httpContextAccessor;

        protected override string CollectionName => "Products";


        public ProductsService(IMongoClient mongoClient,
                               IMapper mapper,
                               IHttpContextAccessor httpContextAccessor,
                               IHttpService httpService,
                               IStoresService storesService,
                               IStoreProductService storeProductService) : base(mongoClient)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _httpService = httpService;
            _storesService = storesService;
            _storeProductService = storeProductService;
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

            var products = _mapper.Map<List<ProductDTO>>(collection);

            await CalculatePrices(products);

            return products;
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
                c => c.DisplayName.Any(name => name.Value == categoryName))).ToListAsync();

            var products = _mapper.Map<List<CoverProductDTO>>(collection);

            await CalculatePrices(products);

            return products;
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

            var dbProduct = await db.GetCollection<ProductDocument>(CollectionName)
                .Find(Builders<ProductDocument>.Filter.Eq("ProductUrl", url)).FirstOrDefaultAsync();

            var product = _mapper.Map<ProductDTO>(dbProduct);

            var ipAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();

            if (ipAddress == null)
                ipAddress = "161.149.146.201";

            if (ipAddress.StartsWith("::ffff:"))
            {
                ipAddress = ipAddress.Substring("::ffff:".Length);
            }

            var userLocation = await _httpService.GetLocationByIpAddressAsync("161.149.146.201");

            var stores = await _storesService.GetStoresByProductIdAsync(product.Id);

            if (stores != null && stores.Count != 0)
            {
                var nearestStore = LocationHelper.GetNearestStore(stores, userLocation.Latitude, userLocation.Longitude);

                product.StoreId = nearestStore.Store.Id;
                product.Price = product.Price + product.Price * (decimal)nearestStore.Coefficient;
                product.IsAvailable = true;
                var storeProductInfo = await _storeProductService.GetProductInfoByStoreAsync(nearestStore.Store.Id, product.Id);
                product.Discount = storeProductInfo.Discount;
                product.DiscountedPrice = Math.Round(product.Price * ((100 - product.Discount) / 100), 2);
            }

            return product;
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

            var products = _mapper.Map<List<SearchProductDTO>>(productDocuments);

            await CalculatePrices(products);

            return products;
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

            var products = _mapper.Map<List<CoverProductDTO>>(productDocuments);

            await CalculatePrices(products);

            return products;
        }

        public async Task<List<SearchProductDTO>> GetSearchProductsByUrls(List<string> urls)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filter = Builders<ProductDocument>.Filter.Where(p => urls.Contains(p.ProductUrl));

            var productDocuments = await db.GetCollection<ProductDocument>(CollectionName).Find(filter).ToListAsync();

            var products = _mapper.Map<List<SearchProductDTO>>(productDocuments);

            await CalculatePrices(products);

            return products;
        }

        public async Task<List<ShoppingCartItemDTO>> GetShoppingCartItemsInformationAsync(List<string> ids)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filter = Builders<ProductDocument>.Filter.Where(p => ids.Contains(p.Id));

            var productDocuments = await db.GetCollection<ProductDocument>(CollectionName).Find(filter).ToListAsync();

            var products = _mapper.Map<List<ShoppingCartItemDTO>>(productDocuments);

            var ipAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();

            if (ipAddress == null)
                ipAddress = "161.149.146.201";

            if (ipAddress.StartsWith("::ffff:"))
            {
                ipAddress = ipAddress.Substring("::ffff:".Length);
            }

            var userLocation = await _httpService.GetLocationByIpAddressAsync("161.149.146.201");

            foreach (var product in products)
            {
                var stores = await _storesService.GetStoresByProductIdAsync(product.ProductId);

                if (stores == null || stores.Count == 0) continue;

                var nearestStore = LocationHelper.GetNearestStore(stores, userLocation.Latitude, userLocation.Longitude);

                product.StoreId = nearestStore.Store.Id;
                product.Price = product.Price + product.Price * (decimal)nearestStore.Coefficient;
                var storeProductInfo = await _storeProductService.GetProductInfoByStoreAsync(nearestStore.Store.Id, product.ProductId);
                product.Discount = storeProductInfo.Discount;
                product.DiscountedPrice = Math.Round(product.Price * ((100 - product.Discount) / 100), 2);
            }

            return products;
        }


        public async Task AddProductsToCategoryAsync(List<SearchCategoryWithProductsDTO> categories)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            foreach(var category in categories)
            {
                var products = await GetCoverProductsByCategoryAsync(category.DisplayName[0].Value);
                category.Products = products.OrderByDescending(p => p.AddedDate).Take(10).ToList();
            }
        }

        private async Task CalculatePrices(IEnumerable<ProductDTOBase> products)
        {
            var ipAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();

            if (ipAddress == null)
                ipAddress = "161.149.146.201";

            if (ipAddress.StartsWith("::ffff:"))
            {
                ipAddress = ipAddress.Substring("::ffff:".Length);
            }

            var userLocation = await _httpService.GetLocationByIpAddressAsync("161.149.146.201");

            foreach (var product in products)
            {
                var stores = await _storesService.GetStoresByProductIdAsync(product.Id);

                if (stores == null || stores.Count == 0) continue;

                var nearestStore = LocationHelper.GetNearestStore(stores, userLocation.Latitude, userLocation.Longitude);

                product.StoreId = nearestStore.Store.Id;
                product.Price = product.Price + product.Price * (decimal)nearestStore.Coefficient;
                product.IsAvailable = true;
                var storeProductInfo = await _storeProductService.GetProductInfoByStoreAsync(nearestStore.Store.Id, product.Id);
                product.Discount = storeProductInfo.Discount;
                product.DiscountedPrice = Math.Round(product.Price * ((100 - product.Discount) / 100), 2);
            }
        }
    }
}
