using Microsoft.AspNetCore.Http;
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

        public StoresController(IStoresService storesService)
        {
            _storesService = storesService;
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
            var result = await _storesService.AddProductToStoreAsync(request.StoreProduct.ProductId, request.StoreProduct.StoreId, request.StoreProduct.Count);

            return Ok();
        }

        [HttpPost]
        [Route("available")]
        public async Task<IActionResult> AreProductsAvailable([FromBody] AreProductsAvailableRequest request)
        {
            var result = await _storesService.AreProductsAvailableAsync(request.StoreProducts);

            return Ok(result);
        }

        [HttpPost]
        [Route("buy/products")]
        public async Task<IActionResult> BuyProductFromStore([FromBody] BuyProductsFromStoreRequest request)
        {
            var result = await _storesService.BuyProductsFromStoreAsync(request.StoreProducts);

            return Ok();
        }
    }
}
