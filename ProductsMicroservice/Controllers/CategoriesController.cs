using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models;
using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.Requests;
using ProductsMicroservice.Models.Responses;
using SharedResources.Extensions;
using SharedResources.Helpers;
using System.Net;
using System.Web;

namespace ProductsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IProductsService _productsService;
        private ICategoriesService _categoryService;
        private readonly IRedisService _redisService;

        public CategoriesController(IProductsService productsService,
                                    ICategoriesService categoriesService,
                                    IRedisService redisService)
        {
            _productsService = productsService;
            _categoryService = categoriesService;
            _redisService = redisService;
        }

        [HttpPost]
        [Route("seed")]
        public async Task<IActionResult> SeedCategories()
        {
            var json = await System.IO.File.ReadAllTextAsync("Resources/categories.json");
            var categories = JsonConvert.DeserializeObject<List<CategoryDTO>>(json);
            await _categoryService.SeedCategoriesAsync(categories);
            return Ok();
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryService.GetCategoriesAsync();

            return Ok(categories);
        }

        [HttpGet]
        [Route("{url}")]
        public async Task<IActionResult> GetCategoryByUrl(string url)
        {
            var decodedUrl = HttpUtility.UrlDecode(url);
            var category = await _categoryService.GetSubCategoriesCategoryByUrl(decodedUrl);

#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
            Task.Run(async () =>
            {
                var userId = "";
                var idType = "";

                var token = Request.GetAuthorizationToken();

                if (!string.IsNullOrEmpty(token))
                {
                    var email = await HttpRequests.GetUserEmailAsync(token);
                    userId = email;
                    idType = "email";
                }
                else
                {
                    var browserId = Request.Headers["BrowserId"].ToString();
                    userId = browserId;
                    idType = "browserid";
                }
                _redisService.VisitCategoryAsync(decodedUrl, userId, idType);
            });
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

            var count = await _productsService.GetProductCountByCategoryUrlAsync(decodedUrl);

            var tags = await _productsService.GetTagsAsync(category);

            return Ok(new CategoryResponse
            {
                Category= category,
                NumberOfProducts = count,
                Tags = tags
            });
        }

        [HttpGet]
        [Route("user")]
        public async Task<IActionResult> GetCategoriesWithNewstProductsForUser()
        {
            string userId;
            string idType;

            var token = Request.GetAuthorizationToken();

            if (!string.IsNullOrEmpty(token))
            {
                var email = await HttpRequests.GetUserEmailAsync(token);
                userId = email;
                idType = "email";
            }
            else
            {
                var browserId = Request.Headers["BrowserId"].ToString();
                userId = browserId;
                idType = "browserid";
            }

            var categories = await _redisService.GetUserCategoriesWithNewsestProductsAsync(userId, idType);

            return Ok(categories);
        }

        [HttpGet]
        [Route("with-subcategories")]
        public async Task<IActionResult> GetCategoriesWithSubCategories()
        {
            var categories = await _categoryService.GetCategoriesWithSubcategoriesAsync();

            return Ok(categories);
        }

        [HttpGet]
        [Route("visits/most-popular")]
        public async Task<IActionResult> GetMostPopularCategories()
        {
            var categories = await _redisService.GetMostPopularCategoriesAsync();

            return Ok(categories);
        }

        [HttpGet]
        [Route("exists/{url}")]
        public async Task<IActionResult> CheckIfCategoryExists(string url)
        {
            var result = await _categoryService.UrlPathExists(HttpUtility.UrlDecode(url));

            if (result)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
        {
            var result = await _categoryService.CreateCategoryAsync(request.Category);

            return Ok();
        }
    }
}
