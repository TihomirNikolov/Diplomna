﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Requests;
using ProductsMicroservice.Models.Stores;

namespace ProductsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoresController : ControllerBase
    {
        private readonly IStoresService _storesService;
        private readonly IStoreProductService _storeProductService;

        public StoresController(IStoresService storesService,
                                IStoreProductService storeProductService)
        {
            _storesService = storesService;
            _storeProductService = storeProductService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetStores()
        {
            var result = await _storesService.GetStoresAsync();

            return Ok(result);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateStore([FromBody] Store store)
        {
            var result = await _storesService.CreateStoreAsync(store);

            return Ok();
        }

        [HttpPost]
        [Route("add/product")]
        public async Task<IActionResult> AddProductToStore([FromBody] AddProductToStoreRequest request)
        {
            var result = await _storeProductService.AddProductToStoreAsync(request.ProductId, request.StoreId, request.Count);

            return Ok();
        }
    }
}
