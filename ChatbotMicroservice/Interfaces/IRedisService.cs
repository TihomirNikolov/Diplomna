namespace ChatbotMicroservice.Interfaces
{
    public interface IRedisService
    {
        Task SaveMessageAsync(string message, string status);
    }
}
