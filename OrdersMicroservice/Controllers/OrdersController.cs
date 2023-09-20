using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrdersMicroservice.Interfaces;
using OrdersMicroservice.Models.Database;
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

            if (string.IsNullOrEmpty(response))
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("create/browserId")]
        public async Task<IActionResult> CreateOrderByBrowserId([FromBody] AddOrderByBrowserIdRequest request)
        {
            var response = await _ordersService.CreateOrderAsync(request.BrowserId, request.OrderItems, request.Address, request.Comment, request.CardPayment);

            if (string.IsNullOrEmpty(response))
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

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

        [HttpGet]
        [Route("get/id/{orderId}")]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            var result = await _ordersService.GetOrderByIdAsync(orderId);

            if (result == null)
                return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(result);
        }

        [HttpGet]
        [Route("get-new")]
        public async Task<IActionResult> GetNewOrders()
        {
            var orders = await _ordersService.GetOrdersByStatusAsync(OrderStatusEnum.New);

            return Ok(orders);
        }

        [HttpGet]
        [Route("get-non-finished")]
        public async Task<IActionResult> GetNonFinishedOrders()
        {
            var orders = await _ordersService.GetNonFinishedOrdersAsync();

            return Ok(orders);
        }

        [HttpGet]
        [Route("get-cancelled")]
        public async Task<IActionResult> GetCancelledOrders()
        {
            var orders = await _ordersService.GetOrdersByStatusAsync(OrderStatusEnum.Cancelled);

            return Ok(orders);
        }

        [HttpGet]
        [Route("get-finishedCount/{year}")]
        public async Task<IActionResult> GetFinishedOrdersCountByYear(string year)
        {
            var result = int.TryParse(year, out var parsedYear);
            if (!result)
                return BadRequest();

            var orders = await _ordersService.GetFinishedOrdersCountAsync(parsedYear);

            return Ok(orders);
        }

        [HttpGet]
        [Route("get-finished/{month}")]
        public async Task<IActionResult> GetFinishedOrdersByMonth(string month)
        {
            var result = int.TryParse(month, out var parsedMonth);
            if (!result)
                return BadRequest();

            var orders = await _ordersService.GetFinishedOrdersByMonthAsync(parsedMonth);

            return Ok(orders);
        }

        [HttpPut]
        [Route("update-status")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateOrderStatusRequest request)
        {
            await _ordersService.UpdateOrderStatusAsync(request.OrderId, request.OrderStatus);

            return Ok();
        }

        [HttpGet]
        [Route("order-items/{orderId}")]
        public async Task<IActionResult> GetOrderItems(string orderId)
        {
            var items = await _ordersService.GetOrderItemsAsync(orderId);

            return Ok(items);
        }
    }
}
