using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SharedResources.Extensions;
using SharedResources.Helpers;
using ShoppingCartMicroservice.Interfaces;
using ShoppingCartMicroservice.Models.Requests;

namespace ShoppingCartMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCartController : ControllerBase
    {
        private readonly IRedisService _redisService;
        private readonly IShoppingCartService _shoppingCartService;

        public ShoppingCartController(IRedisService redisService,
                                      IShoppingCartService shoppingCartService)
        {
            _redisService = redisService;
            _shoppingCartService = shoppingCartService;
        }

        [HttpGet]
        [Route("get/email")]
        public async Task<IActionResult> GetShoppingCartByEmail()
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var shoppingCartItems = await _shoppingCartService.GetShoppingCartByEmailAsync(email);

            return Ok(shoppingCartItems);
        }

        [HttpGet]
        [Route("get/browserid/{browserId}")]
        public async Task<IActionResult> GetShoppingCartByBrowserId(string browserId)
        {
            var shoppingCartItems = await _shoppingCartService.GetShoppingCartByBrowserIdAsync(browserId);

            return Ok(shoppingCartItems);
        }

        [HttpPost]
        [Route("add/email")]
        public async Task<IActionResult> AddItemToShoppingCartByEmailAsync([FromBody] AddShoppingCartItemEmail request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var shoppingCartItems = await _redisService.AddItemToShoppingCartByEmailAsync(email, request.ProductUrl, request.Number);

            return Ok(shoppingCartItems);
        }

        [HttpPost]
        [Route("add/browserid")]
        public async Task<IActionResult> AddItemToShoppingCartByBrowserIdAsync([FromBody] AddShoppingCartItemBrowserId request)
        {
            var shoppingCartItems = await _redisService.AddItemToShoppingCartByBrowserIdAsync(request.BrowserId, request.ProductUrl, request.Number);

            return Ok(shoppingCartItems);
        }

        [HttpPost]
        [Route("remove/email")]
        public async Task<IActionResult> RemoveItemFromShoppingCartByEmailAsync([FromBody] RemoveShoppingCartItemByEmail request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var shoppingCartItems = await _redisService.DeleteShoppingCartItemByEmailAsync(email, request.ProductUrl);

            return Ok(shoppingCartItems);
        }

        [HttpPost]
        [Route("remove/browserId")]
        public async Task<IActionResult> RemoveItemFromShoppingCartByEmailAsync([FromBody] RemoveShoppingCartItemByBrowserId request)
        {
            var shoppingCartItems = await _redisService.DeleteShoppingCartItemByBrowserIdAsync(request.BrowserId, request.ProductUrl);

            return Ok(shoppingCartItems);
        }

        [HttpPut]
        [Route("update/email")]
        public async Task<IActionResult> UpdateShoppingCartItemByEmail([FromBody] AddShoppingCartItemEmail request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var shoppingCartItems = await _redisService.UpdateItemToShoppingCartByEmailAsync(email, request.ProductUrl, request.Number);

            return Ok(shoppingCartItems);
        }

        [HttpPut]
        [Route("update/browserid")]
        public async Task<IActionResult> UpdateShoppingCartItemByBrowserId([FromBody] AddShoppingCartItemBrowserId request)
        {
            var shoppingCartItems = await _redisService.UpdateItemToShoppingCartByBrowserIdAsync(request.BrowserId, request.ProductUrl, request.Number);

            return Ok(shoppingCartItems);
        }

    }
}
