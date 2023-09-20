using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ProductsMicroservice.Models.Stores
{
    public class StoreProductBase
    {
        public int Count { get; set; }
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Discount { get; set; }
    }
}
