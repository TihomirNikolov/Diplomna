using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using AutoMapper;
using Newtonsoft.Json;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Redis;
using StackExchange.Redis;

namespace ProductsMicroservice.Services
{
    public class RedisService : IRedisService
    {
        private readonly IConnectionMultiplexer _redis;

        private readonly IProductsService _productsService;
        private readonly ICategoriesService _categoriesService;

        private readonly IMapper _mapper;

        public RedisService(IConnectionMultiplexer redis,
                            IProductsService productsService,
                            ICategoriesService categoriesService,
                            IMapper mapper)
        {
            _redis = redis;
            _productsService = productsService;
            _categoriesService = categoriesService;
            _mapper = mapper;
        }

        public async Task VisitProductAsync(string productUrl)
        {
            var db = _redis.GetDatabase();

            var url = "product:" + productUrl;

            if (await db.KeyExistsAsync(url))
            {
                var value = JsonConvert.DeserializeObject<List<DateTime>>(db.StringGet(url).ToString())!;
                value.Add(DateTime.Now);
                await db.StringSetAsync(url, JsonConvert.SerializeObject(value));
            }
            else
            {
                List<DateTime> visits = new List<DateTime>
                {
                    DateTime.Now
                };
                await db.StringSetAsync(url, JsonConvert.SerializeObject(visits));
            }
        }
        public async Task<ProductVisit> GetProductVisitsByUrlAsync(string url)
        {
            var db = _redis.GetDatabase();

            var redisUrl = "product:" + url;

            if (!await db.KeyExistsAsync(redisUrl))
                return null;

            var dateTimes = JsonConvert.DeserializeObject<List<DateTime>>(db.StringGet(redisUrl).ToString()!);

            return new ProductVisit { ProductUrl = url, DateTimes = dateTimes };
        }

        public async Task<List<SearchProductDTO>> GetMostPopularProductsAsync()
        {
            var db = _redis.GetDatabase();

            var prefix = "product:";

            var keys = (string[])db.Execute("KEYS", prefix + "*");

            List<ProductVisit> visits = new List<ProductVisit>();

            foreach (var key in keys)
            {
                var value = JsonConvert.DeserializeObject<List<DateTime>>((await db.StringGetAsync(key)).ToString()!);
                visits.Add(new ProductVisit { ProductUrl = key, DateTimes = value });
            }

            var urls = visits.OrderBy(v => v.DateTimes.Count).Take(5).Select(v => v.ProductUrl.Split(prefix)[1]).ToList();

            var products = await _productsService.GetSearchProductsByUrls(urls);

            return products;
        }

        public async Task VisitCategoryAsync(string categoryUrl, string id, string idType)
        {
            var db = _redis.GetDatabase();

            var url = "category:" + categoryUrl;

            if (await db.KeyExistsAsync(url))
            {
                var value = JsonConvert.DeserializeObject<List<DateTime>>(db.StringGet(url).ToString())!;
                value.Add(DateTime.Now);
                await db.StringSetAsync(url, JsonConvert.SerializeObject(value));
            }
            else
            {
                List<DateTime> visits = new List<DateTime>
                {
                    DateTime.Now
                };
                await db.StringSetAsync(url, JsonConvert.SerializeObject(visits));
            }

            var userUrl = "user:" + idType + ":" + id;

            if (await db.KeyExistsAsync(userUrl))
            {
                var value = JsonConvert.DeserializeObject<List<CategoryVisit>>(db.StringGet(userUrl).ToString())!;
                if (value.Any(v => v.CategoryUrl == categoryUrl))
                {
                    value.FirstOrDefault(v => v.CategoryUrl == categoryUrl)?.DateTimes.Add(DateTime.Now);
                }
                else
                {
                    value.Add(new CategoryVisit
                    {
                        CategoryUrl = categoryUrl,
                        DateTimes = new List<DateTime> { DateTime.Now }
                    });
                }
                await db.StringSetAsync(userUrl, JsonConvert.SerializeObject(value));
            }
            else
            {
                List<CategoryVisit> visits = new List<CategoryVisit>
                {
                    new CategoryVisit {
                        DateTimes = new List<DateTime>
                        {
                            DateTime.Now
                        },
                        CategoryUrl = categoryUrl
                    }
                };
                await db.StringSetAsync(userUrl, JsonConvert.SerializeObject(visits));
            }
        }

        public async Task<List<SearchCategoryDTO>> GetMostPopularCategoriesAsync()
        {
            var db = _redis.GetDatabase();

            var prefix = "category:";

            var keys = (string[])db.Execute("KEYS", prefix + "*");

            List<CategoryVisit> visits = new List<CategoryVisit>();

            foreach (var key in keys)
            {
                var value = JsonConvert.DeserializeObject<List<DateTime>>((await db.StringGetAsync(key)).ToString()!);
                visits.Add(new CategoryVisit { CategoryUrl = key, DateTimes = value });
            }

            var urls = visits.OrderBy(v => v.DateTimes.Count).Take(5).Select(v => v.CategoryUrl.Split(prefix)[1]).ToList();

            var categories = await _categoriesService.GetCategoriesByUrlsAsync(urls);

            return categories;
        }

        public async Task<List<SearchCategoryWithProductsDTO>> GetUserCategoriesWithNewsestProductsAsync(string id, string idType)
        {
            var db = _redis.GetDatabase();

            var userUrl = "user:" + idType + ":" + id;

            List<CategoryVisit> visits = new List<CategoryVisit>();

            if (await db.KeyExistsAsync(userUrl))
            {
                var value = JsonConvert.DeserializeObject<List<CategoryVisit>>(db.StringGet(userUrl).ToString())!;
                visits = value;
            }

            var categories = _mapper.Map<List<SearchCategoryWithProductsDTO>>(await _categoriesService.GetCategoriesByUrlsAsync(visits.OrderByDescending(v => v.DateTimes.Count).Take(5).Select(v => v.CategoryUrl).ToList()));

            var orderedCategories = categories
                                    .Join(visits, c => c.UrlPath, v => v.CategoryUrl,
                                    (s, f) => new
                                    {
                                        Item = s,
                                        f.DateTimes.Count
                                    })
                                    .OrderByDescending(item => item.Count)
                                    .Select(item => item.Item)
                                    .ToList();


            await _productsService.AddProductsToCategoryAsync(orderedCategories);

            return orderedCategories;
        }
    }
}
