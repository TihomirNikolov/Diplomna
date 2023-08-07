using Microsoft.AspNetCore.Mvc;
using PaymentsMicroservice.Interfaces;
using PaymentsMicroservice.Models.Requests;
using SharedResources.Extensions;
using SharedResources.Helpers;

namespace PaymentsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentsService _paymentsService;

        public PaymentsController(IPaymentsService paymentsService)
        {
            _paymentsService = paymentsService;
        }

        [HttpPost]
        [Route("/create/existing-card")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentExistingCardRequest request)
        {
            var result = await _paymentsService.CreatePaymentWithExistingCardAsync(request.OrderId, request.CardId, request.Amount);

            return result ? Ok() : StatusCode(StatusCodes.Status500InternalServerError);
        }

        [HttpPost]
        [Route("/create/new-card")]
        public async Task<IActionResult> CreatePaymentWithNewCard([FromBody] CreatePaymentNewCardRequest request)
        {
            var token = Request.GetAuthorizationToken();

            var email = await HttpRequests.GetUserEmailAsync(token);

            var result = await _paymentsService.CreatePaymentWithNewCardAsync(request.OrderId, email, request.NewCard, request.Amount);

            return result ? Ok() : StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
