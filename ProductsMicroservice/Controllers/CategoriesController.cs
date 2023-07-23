using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models;
using ProductsMicroservice.Models.Requests;
using System.Web;

namespace ProductsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private ICategoriesService _categoryService;
        private readonly IRedisService _redisService;

        public CategoriesController(ICategoriesService categoriesService,
                                    IRedisService redisService)
        {
            _categoryService = categoriesService;
            _redisService = redisService;
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
            _redisService.VisitCategoryAsync(decodedUrl);
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

            return Ok(category);
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
