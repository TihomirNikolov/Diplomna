﻿using Microsoft.AspNetCore.Http;
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
        public async Task<IActionResult> AddItemToShoppingCartByEmail([FromBody] AddShoppingCartItemEmail request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            await _redisService.AddItemToShoppingCartByEmailAsync(email, request.ProductId, request.Number);

            return Ok();
        }

        [HttpPost]
        [Route("add/browserid")]
        public async Task<IActionResult> AddItemToShoppingCartByBrowserId([FromBody] AddShoppingCartItemBrowserId request)
        {
            await _redisService.AddItemToShoppingCartByBrowserIdAsync(request.BrowserId, request.ProductId, request.Number);

            return Ok();
        }

        [HttpPost]
        [Route("remove/email")]
        public async Task<IActionResult> RemoveItemFromShoppingCartByEmail([FromBody] RemoveShoppingCartItemByEmail request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            await _redisService.RemoveShoppingCartItemByEmailAsync(email, request.ProductId);

            return Ok();
        }

        [HttpPost]
        [Route("remove/browserId")]
        public async Task<IActionResult> RemoveItemFromShoppingCartByEmail([FromBody] RemoveShoppingCartItemByBrowserId request)
        {
            await _redisService.RemoveShoppingCartItemByBrowserIdAsync(request.BrowserId, request.ProductId);

            return Ok();
        }

        [HttpPost]
        [Route("merge")]
        public async Task<IActionResult> MergeBrowserIdIntoEmailShoppingCart([FromBody] MergeShoppingCart request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var shoppingCartItems = await _shoppingCartService.MergeShoppingCartsAsync(email, request.BrowserId);

            return Ok(shoppingCartItems);
        }

        [HttpPut]
        [Route("update/email")]
        public async Task<IActionResult> UpdateShoppingCartItemByEmail([FromBody] AddShoppingCartItemEmail request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            await _redisService.UpdateItemToShoppingCartByEmailAsync(email, request.ProductId, request.Number);

            return Ok();
        }

        [HttpPut]
        [Route("update/browserid")]
        public async Task<IActionResult> UpdateShoppingCartItemByBrowserId([FromBody] AddShoppingCartItemBrowserId request)
        {
            await _redisService.UpdateItemToShoppingCartByBrowserIdAsync(request.BrowserId, request.ProductId, request.Number);

            return Ok();
        }

        [HttpDelete]
        [Route("delete/email")]
        public async Task<IActionResult> DeleteShoppingCartByEmail()
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            await _redisService.DeleteShoppingCartByEmailAsync(email);

            return Ok();
        }

        [HttpDelete]
        [Route("delete/browserid/{browserId}")]
        public async Task<IActionResult> DeleteShoppingCartByBrowserId(string browserId)
        {
           await _redisService.DeleteShoppingCartByBrowserIdAsync(browserId);

            return Ok();
        }
    }
}
