using MongoDB.Driver;

namespace ProductsMicroservice.Services
{
    public abstract class BaseService
    {
        protected abstract string CollectionName { get; }
        protected IMongoClient _mongoClient;
        protected BaseService(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }

        protected async Task CreateCollectionIfDoesntExistAsync()
        {
            var db = _mongoClient.GetDatabase("MongoDB");

            var collectionExists = (await db.ListCollectionNamesAsync()).ToList().Contains(CollectionName);
            if (!collectionExists)
            {
                await db.CreateCollectionAsync(CollectionName);
            }
        }

        protected IMongoDatabase GetDatabase()
        {
            return _mongoClient.GetDatabase("MongoDB");
        }
    }
}
