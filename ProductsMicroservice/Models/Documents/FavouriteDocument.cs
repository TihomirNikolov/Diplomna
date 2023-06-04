using MongoDB.Bson;
using ProductsMicroservice.Models.Favourites;

namespace ProductsMicroservice.Models.Documents
{
    public class FavouriteDocument : Favourite
    {
        public ObjectId Id { get; set; }
        public string Email { get; set; } = string.Empty;
    }
}
