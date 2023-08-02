using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PaymentsMicroservice.Interfaces;
using PaymentsMicroservice.Models.Requests;
using SharedResources.Extensions;
using SharedResources.Helpers;

namespace PaymentsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardsController : ControllerBase
    {
        private readonly ICustomersService _customersService;
        public CardsController(ICustomersService customersService)
        {
            _customersService = customersService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCards()
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var result = await _customersService.GetCustomersCardsAsync(email);
            return Ok(result);
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> AddCard([FromBody] AddCardRequest request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            await _customersService.AddCardAsync(email, request.CardNumber, request.CardholderName, request.Month, request.Year, request.CVV, request.CardType);
            return Ok();
        }

        [HttpDelete]
        [Route("delete/{cardId}")]
        public async Task<IActionResult> DeleteCard(string cardId)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var result = await _customersService.DeleteCustomersCardAsync(email, cardId);

            return result ? Ok() : BadRequest();
        }
    }
}
