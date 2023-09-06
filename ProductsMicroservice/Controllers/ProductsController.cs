using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.Products;
using ProductsMicroservice.Models.Requests;
using SharedResources.Extensions;
using SharedResources.Helpers;

namespace ProductsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        #region Declarations

        private readonly IProductsService _productsService;
        private readonly IRedisService _redisService;

        #endregion

        #region Constructor

        public ProductsController(IProductsService productsService,
                                  IRedisService redisService)
        {
            _productsService = productsService;
            _redisService = redisService;
        }

        #endregion

        [HttpPost]
        [Route("seed")]
        public async Task<IActionResult> SeedProducts()
        {
            var json = await System.IO.File.ReadAllTextAsync("Resources/tvs.json");
            var products = JsonConvert.DeserializeObject<List<Product>>(json);

            await _productsService.SeedProductsAsync(products);

            return Ok();
        }

        #region Get Methods

        [HttpGet]
        [Route("cover")]
        public async Task<IActionResult> GetCoverProducts()
        {
            return Ok(await _productsService.GetCoverProductsAsync());
        }

        [HttpGet]
        [Route("category/{category}")]
        public async Task<IActionResult> GetCoverProductsByCategory(string category)
        {
            var products = await _productsService.GetCoverProductsByCategoryAsync(category);
            return Ok(products);
        }

        [HttpPost]
        [Route("category/{category}/{page}/{itemsPerPage}")]
        public async Task<IActionResult> GetCoverProductsByPageAndItems([FromBody] GetProductsByCategoryRequest request, string category, string page, string itemsPerPage)
        {
            return Ok(await _productsService.GetCoverProductsByCategoryPageAndItemsAsync(category, page, itemsPerPage, request.CheckedFilters, request.SortingType));
        }

        [HttpGet]
        [Route("exists/{url}")]
        public async Task<IActionResult> CheckIfProductExists(string url)
        {
            var result = await _productsService.CheckIfProductExistsAsync(url);

            if (result)
                return Ok();
            else
                return NotFound();
        }

        [HttpGet]
        [Route("{url}")]
        public async Task<IActionResult> GetProductByUrl(string url)
        {
            var product = await _productsService.GetProductByUrlAsync(url);

#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
             _redisService.VisitProductAsync(url);
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

            return Ok(product);
        }

        [HttpGet]
        [Route("search/{searchText}")]
        public async Task<IActionResult> GetBySearchText(string searchText)
        {
            var products = await _productsService.SearchByTextAsync(searchText);

            return Ok(products);
        }

        [HttpGet]
        [Route("search/getall/{searchText}")]
        public async Task<IActionResult> GetAllBySearchText(string searchText)
        {
            var products = await _productsService.GetAllBySearchTextAsync(searchText);

            return Ok(products);
        }

        [HttpGet]
        [Route("visits/{url}")]
        public async Task<IActionResult> GetVisitsByUrl(string url)
        {
            var visits = await _redisService.GetProductVisitsByUrlAsync(url);

            return Ok(visits);
        }

        [HttpGet]
        [Route("visits/most-popular")]
        public async Task<IActionResult> GetMostPopularProducts()
        {
            var products = await _redisService.GetMostPopularProductsAsync();

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

        [HttpPost]
        [Route("add-review")]
        public async Task<IActionResult> AddReview([FromBody] AddReviewRequest request)
        {
            if (request == null || request.Review == null || string.IsNullOrEmpty(request.ProductUrl))
            {
                return BadRequest();
            }

            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);
            request.Review.UserEmail = email;

            await _productsService.AddReviewAsync(request.Review, request.ProductUrl);

            return Ok(request.Review);
        }

        [HttpPost]
        [Route("remove-review")]
        public async Task<IActionResult> RemoveReview([FromBody] RemoveReviewRequest request)
        {
            await _productsService.RemoveReviewAsync(request.Review, request.ProductUrl);

            return Ok();
        }

        [HttpPost]
        [Route("get-by-urls")]
        public async Task<IActionResult> GetByProductUrls([FromBody] GetByProductUrlsRequest request)
        {
            if (request == null || request.ProductUrls == null)
            {
                return BadRequest();
            }

            var products = await _productsService.GetProductsByUrlsAsync(request.ProductUrls);

            return Ok(products);
        }

        [HttpPost]
        [Route("shoppingcart")]
        public async Task<IActionResult> GetShoppingCartInformation([FromBody] List<string> productIds)
        {
            var shoppingCartItems = await _productsService.GetShoppingCartItemsInformationAsync(productIds);

            return Ok(shoppingCartItems);
        }

        [HttpPost]
        [Route("order")]
        public async Task<IActionResult> GetOrderItemsInformation([FromBody] GetOrderItemsRequest request)
        {
            var orderItems = await _productsService.GetOrderItemsInformationAsync(request.ProductIds);

            return Ok(orderItems);
        }

        #endregion
    }
}
