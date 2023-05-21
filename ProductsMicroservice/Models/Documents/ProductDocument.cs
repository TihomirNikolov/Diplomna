using MongoDB.Bson;
using ProductsMicroservice.Models.Products;

namespace ProductsMicroservice.Models.Documents
{
    public class ProductDocument : Product
    {
        public ObjectId Id { get; set; }
    }
}
