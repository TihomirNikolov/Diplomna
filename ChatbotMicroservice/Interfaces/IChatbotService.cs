namespace ChatbotMicroservice.Interfaces
{
    public interface IChatbotService
    {
        Task<string> SendAsync(string message);
    }
}
