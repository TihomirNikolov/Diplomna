using AutoMapper;
using MongoDB.Driver;
using ProductsMicroservice.Helpers;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Products;
using ProductsMicroservice.Models.Responses;
using ProductsMicroservice.Models.Utilities;
using SharedResources.Models;

namespace ProductsMicroservice.Services
{
    public class ProductsService : BaseService, IProductsService
    {
        private readonly IHttpService _httpService;
        private readonly IStoresService _storesService;

        private readonly IMapper _mapper;

        private readonly IHttpContextAccessor _httpContextAccessor;

        protected override string CollectionName => "Products";


        public ProductsService(IMongoClient mongoClient,
                               IMapper mapper,
                               IHttpContextAccessor httpContextAccessor,
                               IHttpService httpService,
                               IStoresService storesService) : base(mongoClient)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _httpService = httpService;
            _storesService = storesService;
        }

        public async Task<long> GetProductCountByCategoryUrlAsync(string categoryUrl)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var count = await db.GetCollection<ProductDocument>(CollectionName)
                    .CountDocumentsAsync(Builders<ProductDocument>.Filter.ElemMatch(c => c.Categories,
                    c => c.UrlPath == categoryUrl));

            return count;
        }

        public async Task<List<Item<List<Item<string, string>>, Filter>>> GetTagsAsync(CategoryDTO category)
        {
            try
            {
                await CreateCollectionIfDoesntExistAsync();

                var db = GetDatabase();

                var categoryTags = category.Tags;

                var products = await db.GetCollection<ProductDocument>(CollectionName)
                    .Find(Builders<ProductDocument>.Filter.ElemMatch(p => p.Categories, c => c.UrlPath == category.UrlPath)).ToListAsync();

                var filters = new List<Item<List<Item<string, string>>, Filter>>();

                var bgCategoryTags = categoryTags.FirstOrDefault(c => c.Key == "bg");
                var enCategoryTags = categoryTags.FirstOrDefault(c => c.Key == "en");

                foreach (var categoryTag in categoryTags.FirstOrDefault(c => c.Key == "bg")!.Value)
                {
                    filters.Add(new Item<List<Item<string, string>>, Filter>
                    {
                        Key = new List<Item<string, string>>
                    {
                        new Item<string, string>
                        {
                            Key = "bg",
                            Value = categoryTag
                        },
                        new Item<string, string>
                        {
                            Key = "en",
                            Value = categoryTag
                        }
                    },
                        Value = new Filter()
                        {
                            Values = new List<Item<List<Item<string, string>>, FilterValue>>()
                        }
                    });
                }

                foreach (var product in products)
                {
                    foreach (var tag in product.Tags.FirstOrDefault()!.Value)
                    {
                        if (filters.Any(filter => filter.Key.Any(k => tag.Key == k.Value)))
                        {
                            var filter = filters.FirstOrDefault(filter => filter.Key.Any(k => tag.Key == k.Value));
                            if (filter == null)
                                continue;

                            if (filter.Value.Values == null)
                            {
                                filter.Value.Values = new List<Item<List<Item<string, string>>, FilterValue>>();
                            }
                            if (filter.Value.Values.Any(v => v.Key.Any(k => k.Value == tag.Value)))
                            {
                                filter.Value.Values.FirstOrDefault(v => v.Key.Any(k => k.Value == tag.Value))!.Value.Count++;
                            }
                            else
                            {
                                filter.Value.Values.Add(
                                    new Item<List<Item<string, string>>, FilterValue>
                                    {
                                        Key = new List<Item<string, string>>
                                        {
                                    new Item<string, string>
                                    {
                                        Key = "bg",
                                        Value = tag.Value
                                    },
                                    new Item<string, string>
                                    {
                                        Key = "en",
                                        Value = tag.Value
                                    },
                                        },
                                        Value = new FilterValue
                                        {
                                            Count = 1,
                                            IsChecked = false
                                        }
                                    });
                            }
                        }
                    }
                }

                return filters;
            }
            catch
            {
                return new List<Item<List<Item<string, string>>, Filter>>();
            }
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

        public async Task<CoverProductsResponse> GetCoverProductsByCategoryPageAndItemsAsync(string categoryName, int pageNumber, 
                                                                                             int itemsPerPage, List<CheckedFilter> filters,
                                                                                             string sortingType)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filterBuilder = Builders<ProductDocument>.Filter;
            var mongoFilters = new List<FilterDefinition<ProductDocument>>();
            var sortingBuilder = Builders<ProductDocument>.Sort;
            SortDefinition<ProductDocument> sortDefinition;
            switch (sortingType)
            {
                case "lowestPrice":
                    sortDefinition = sortingBuilder.Ascending(p => p.Price);
                    break;
                case "highestPrice":
                    sortDefinition = sortingBuilder.Descending(p => p.Price);
                    break;
                case "newest":
                    sortDefinition = sortingBuilder.Descending(p => p.AddedDate);
                    break;
                default:
                    sortDefinition = sortingBuilder.Descending(p => p.AddedDate);
                    break;
            }

            mongoFilters.Add(Builders<ProductDocument>.Filter.ElemMatch(c => c.Categories,
                        c => c.DisplayName.Any(name => name.Value == categoryName)));

            if (filters != null && filters.Count > 0)
            {
                mongoFilters.Add(Builders<ProductDocument>.Filter.Or(
                    filters.Select(filterItem =>
                        Builders<ProductDocument>.Filter.ElemMatch(
                            x => x.Tags,
                            tag => tag.Value.Any(t => t.Key == filterItem.Key) && tag.Value.Any(t => filterItem.Values.Contains(t.Value))
                        )
                    )
                ));
            }

            var combinedFilter = filterBuilder.And(mongoFilters);

            var collection = await db.GetCollection<ProductDocument>(CollectionName).Find(combinedFilter)
                .Sort(sortDefinition)
                .Skip((pageNumber - 1) * itemsPerPage)
                .Limit(itemsPerPage)
                .ToListAsync();

            var products = _mapper.Map<List<CoverProductDTO>>(collection);

            await CalculatePrices(products);

            var count = await db.GetCollection<ProductDocument>(CollectionName)
                    .CountDocumentsAsync(combinedFilter);

            return new CoverProductsResponse
            {
                Products = products,
                Count = count
            };
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
                product.Price = Math.Round(product.Price + product.Price * (decimal)nearestStore.Coefficient, 2);
                product.IsAvailable = true;
                var storeProductInfo = await _storesService.GetProductInfoByStoreAsync(nearestStore.Store.Id, product.Id);
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

        public async Task<List<CoverProductDTO>> GetAllBySearchTextAsync(string searchText, int pageNumber,
                                                                         int itemsPerPage, string sortingType)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var sortingBuilder = Builders<ProductDocument>.Sort;
            SortDefinition<ProductDocument> sortDefinition;
            switch (sortingType)
            {
                case "lowestPrice":
                    sortDefinition = sortingBuilder.Ascending(p => p.Price);
                    break;
                case "highestPrice":
                    sortDefinition = sortingBuilder.Descending(p => p.Price);
                    break;
                case "newest":
                    sortDefinition = sortingBuilder.Descending(p => p.AddedDate);
                    break;
                default:
                    sortDefinition = sortingBuilder.Descending(p => p.AddedDate);
                    break;
            }

            var filters = Builders<ProductDocument>.Filter.Or(
                Builders<ProductDocument>.Filter.ElemMatch(p => p.Name, name => name.Value.ToLower().Contains(searchText.ToLower())),
                Builders<ProductDocument>.Filter.ElemMatch(p => p.Description, desc => desc.Value.ToLower().Contains(searchText.ToLower())),
                Builders<ProductDocument>.Filter.ElemMatch(p => p.Tags, tags => tags.Value.Any(t => t.Value.ToLower().Contains(searchText.ToLower())))
                );

            var productDocuments = await db.GetCollection<ProductDocument>(CollectionName)
                                           .Find(filters)
                                           .Sort(sortDefinition)
                                           .Skip((pageNumber - 1) * itemsPerPage)
                                           .Limit(itemsPerPage)
                                           .ToListAsync();

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
                product.Price = Math.Round(product.Price + product.Price * (decimal)nearestStore.Coefficient, 2);
                var storeProductInfo = await _storesService.GetProductInfoByStoreAsync(nearestStore.Store.Id, product.ProductId);
                product.Discount = storeProductInfo.Discount;
                product.DiscountedPrice = Math.Round(product.Price * ((100 - product.Discount) / 100), 2);
            }

            return products;
        }

        public async Task<List<OrderItemDTO>> GetOrderItemsInformationAsync(List<string> ids)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filter = Builders<ProductDocument>.Filter.Where(p => ids.Contains(p.Id));

            var productDocuments = await db.GetCollection<ProductDocument>(CollectionName).Find(filter).ToListAsync();

            var products = _mapper.Map<List<OrderItemDTO>>(productDocuments);

            return products;
        }

        public async Task AddProductsToCategoryAsync(List<SearchCategoryWithProductsDTO> categories)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            foreach (var category in categories)
            {
                var products = await GetNewestCoverProductsByCategoryAsync(category.DisplayName[0].Value, 10);
                category.Products = products;
            }
        }

        public async Task<List<CoverProductDTO>> GetNewestCoverProductsByCategoryAsync(string categoryName, int numberOfProducts)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var collection = await db.GetCollection<ProductDocument>(CollectionName)
                .Find(Builders<ProductDocument>.Filter.ElemMatch(c => c.Categories,
                c => c.DisplayName.Any(name => name.Value == categoryName)))
                .SortByDescending(p => p.AddedDate)
                .Limit(numberOfProducts)
                .ToListAsync();

            var products = _mapper.Map<List<CoverProductDTO>>(collection);

            await CalculatePrices(products);

            return products;
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
                product.Price = Math.Round(product.Price + product.Price * (decimal)nearestStore.Coefficient, 2);
                product.IsAvailable = true;
                var storeProductInfo = await _storesService.GetProductInfoByStoreAsync(nearestStore.Store.Id, product.Id);
                product.Discount = storeProductInfo.Discount;
                product.DiscountedPrice = Math.Round(product.Price * ((100 - product.Discount) / 100), 2);
            }
        }

        public async Task SeedProductsAsync(List<Product> products)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var documents = _mapper.Map<List<ProductDocument>>(products);

            await db.GetCollection<ProductDocument>(CollectionName).InsertManyAsync(documents);
        }
    }
}
