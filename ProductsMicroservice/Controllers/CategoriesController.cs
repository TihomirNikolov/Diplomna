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

        public CategoriesController(ICategoriesService categoriesService)
        {
            _categoryService = categoriesService;
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
            var category = await _categoryService.GetSubCategoriesCategoryByUrl(HttpUtility.UrlDecode(url));

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
        [Route("tags")]
        public async Task<IActionResult> GetCategoryWithTags()
        {

            return Ok();
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
