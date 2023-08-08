using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using ProductsMicroservice.Models.Favourites;

namespace ProductsMicroservice.Models.Documents
{
    public class FavouriteDocument : Favourite
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
