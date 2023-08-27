using ChatbotMicroservice.Interfaces;
using ChatbotMicroservice.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatbotMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;

        public ChatbotController(IChatbotService chatbotService)
        {
            _chatbotService = chatbotService;
        }

        [HttpPost]
        [Route("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            //var result = await _chatbotService.SendAsync(request.Message);

            //if (string.IsNullOrEmpty(result))
            //    return StatusCode(StatusCodes.Status500InternalServerError);

            //return Ok(result);
            await Task.Delay(3000);

            return Ok("Result");
        }
    }
}
