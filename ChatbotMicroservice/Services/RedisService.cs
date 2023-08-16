using ChatbotMicroservice.Interfaces;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace ChatbotMicroservice.Services
{
    public class RedisService : IRedisService
    {
        private readonly IConnectionMultiplexer _redis;

        public RedisService(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        public async Task SaveMessageAsync(string message, string status)
        {
            var db = _redis.GetDatabase();

            var url = "chat:" + status;

            if (await db.KeyExistsAsync(url))
            {
                var value = JsonConvert.DeserializeObject<List<string>>(db.StringGet(url).ToString())!;
                value.Add(message);
                await db.StringSetAsync(url, JsonConvert.SerializeObject(value));
            }
            else
            {
                List<string> messages = new List<string>
                {
                    message
                };
                await db.StringSetAsync(url, JsonConvert.SerializeObject(messages));
            }
        }
    }
}
