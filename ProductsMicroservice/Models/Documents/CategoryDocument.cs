using MongoDB.Bson;
using ProductsMicroservice.Models.Categories;

namespace ProductsMicroservice.Models.Documents
{
    public class CategoryDocument : Category
    {
        public ObjectId Id { get; set; }
    }
}
