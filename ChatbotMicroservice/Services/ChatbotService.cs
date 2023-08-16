using ChatbotMicroservice.Interfaces;
using OpenAI_API;
using OpenAI_API.Chat;
using OpenAI_API.Models;

namespace ChatbotMicroservice.Services
{
    public class ChatbotService : IChatbotService
    {
        private readonly OpenAIAPI _openAiApi;
        private readonly IRedisService _redisService;

        public ChatbotService(IRedisService redisService) 
        {
            _openAiApi = new OpenAIAPI("");
            _redisService = redisService;
        }

        public async Task<string> SendAsync(string message)
        {
            try
            {
                var response = await _openAiApi.Chat.CreateChatCompletionAsync(new ChatRequest()
                { 
                    Model =  Model.ChatGPTTurbo,
                    Temperature = 0.1,
                    MaxTokens= 50,
                    Messages = new ChatMessage[]
                    {
                        new ChatMessage(ChatMessageRole.User, message)
                    }
                });
                await _redisService.SaveMessageAsync(message, "success");

                return response.ToString();
            }
            catch (Exception ex)
            {
                await _redisService.SaveMessageAsync(message, "error");
                return "";
            }
        }
    }
}
