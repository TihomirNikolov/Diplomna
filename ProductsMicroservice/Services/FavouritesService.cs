using AutoMapper;
using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.Favourites;

namespace ProductsMicroservice.Services
{
    public class FavouritesService : BaseService, IFavouritesService
    {
        private IMapper _mapper;

        protected override string CollectionName => "Favourites";

        public FavouritesService(IMongoClient mongoClient, IMapper mapper) : base(mongoClient)
        {
            _mapper = mapper;
        }

        public async Task AddFavourite(string email, string productUrl)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var favourites = await db.GetCollection<FavouriteDocument>(CollectionName)
                                    .Find(Builders<FavouriteDocument>.Filter.Eq("Email", email)).FirstOrDefaultAsync();

            if (favourites != null)
            {
                if (!favourites.ProductUrls.Contains(productUrl))
                {
                    favourites.ProductUrls.Add(productUrl);

                    var filter = Builders<FavouriteDocument>.Filter
                                    .Eq(f => f.Email, email.ToLower());
                    var update = Builders<FavouriteDocument>.Update
                                    .Set(f => f.ProductUrls, favourites.ProductUrls);

                    await db.GetCollection<FavouriteDocument>(CollectionName).UpdateOneAsync(filter, update);
                }
            }
            else
            {
                var newFavourites = new FavouriteDocument
                {
                    Email = email.ToLower(),
                    ProductUrls = new List<string> { productUrl }
                };

                await db.GetCollection<FavouriteDocument>(CollectionName).InsertOneAsync(newFavourites);
            }
        }

        public async Task RemoveFavourite(string email, string productUrl)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var favourites = await db.GetCollection<FavouriteDocument>(CollectionName)
                        .Find(Builders<FavouriteDocument>.Filter.Eq("Email", email)).FirstOrDefaultAsync();

            if (favourites != null)
            {
                if (favourites.ProductUrls.Contains(productUrl))
                {
                    favourites.ProductUrls.Remove(productUrl);

                    var filter = Builders<FavouriteDocument>.Filter
                                    .Eq(f => f.Email, email.ToLower());
                    var update = Builders<FavouriteDocument>.Update
                                    .Set(f => f.ProductUrls, favourites.ProductUrls);

                    await db.GetCollection<FavouriteDocument>(CollectionName).UpdateOneAsync(filter, update);
                }
            }
        }

        public async Task<List<string>> GetFavouritesByEmail(string email)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var favourites = await db.GetCollection<FavouriteDocument>(CollectionName)
                        .Find(Builders<FavouriteDocument>.Filter.Eq("Email", email)).FirstOrDefaultAsync();

            if (favourites == null)
                return new List<string>();

            return favourites.ProductUrls;
        }
    }
}
