﻿using Microsoft.AspNetCore.Mvc;
using ProductsMicroservice.Extensions;
using ProductsMicroservice.Helpers;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Products;
using ProductsMicroservice.Models.Requests;

namespace ProductsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        #region Declarations

        private readonly IProductsService _productsService;
        private readonly HttpRequestHelper _httpRequestHelper;

        #endregion

        #region Constructor

        public ProductsController(IProductsService productsService, HttpRequestHelper httpRequestHelper)
        {
            _productsService = productsService;
            _httpRequestHelper = httpRequestHelper;
        }

        #endregion

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

            return Ok(product);
        }

        [HttpGet]
        [Route("search/{searchText}")]
        public async Task<IActionResult> GetBySearchText(string searchText)
        {
            var products = await _productsService.SearchByTextAsync(searchText);

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

            var email = await _httpRequestHelper.GetUserEmailAsync(token);
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

        #endregion
    }
}
