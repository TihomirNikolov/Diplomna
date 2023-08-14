using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrdersMicroservice.Interfaces;
using OrdersMicroservice.Models.Requests;
using SharedResources.Extensions;
using SharedResources.Helpers;

namespace OrdersMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersService _ordersService;

        public OrdersController(IOrdersService ordersService)
        {
            _ordersService = ordersService;
        }

        [HttpPost]
        [Route("create/email")]
        public async Task<IActionResult> CreateOrderByEmail([FromBody] AddOrderByEmailRequest request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var response = await _ordersService.CreateOrderAsync(email, request.OrderItems, request.Address, request.Comment, request.CardPayment);

            return Ok(response);
        }

        [HttpPost]
        [Route("create/browserId")]
        public async Task<IActionResult> CreateOrderByBrowserId([FromBody] AddOrderByBrowserIdRequest request)
        {
            var response = await _ordersService.CreateOrderAsync(request.BrowserId, request.OrderItems, request.Address, request.Comment, request.CardPayment);

            return Ok(response);
        }

        [HttpGet]
        [Route("get")]
        public async Task<IActionResult> GetOrders()
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var result = await _ordersService.GetOrdersAsync(email);

            return Ok(result);
        }
    }
}
