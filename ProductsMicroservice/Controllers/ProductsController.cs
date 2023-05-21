using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Products;

namespace ProductsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        #region Declarations

        private IProductsService _productsService;

        #endregion

        #region Constructor

        public ProductsController(IProductsService productsService)
        {
            _productsService = productsService;
        }

        #endregion

        #region Get Methods

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _productsService.GetProductsAsync());
        }

        [HttpGet]
        [Route("cover")]
        public async Task<IActionResult> GetCoverProducts()
        {
            return Ok(await _productsService.GetCoverProductsAsync());
        }

        [HttpGet]
        [Route("{category}")]
        public async Task<IActionResult> GetCoverProductsByCategory(string category)
        {
            var products = await _productsService.GetCoverProductsByCategoryAsync(category);
            return Ok(products);
        }

        #endregion

        #region Post Methods

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            await _productsService.CreateProductAsync(product);
            return Ok();
        }

        #endregion
    }
}
