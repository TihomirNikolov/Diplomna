using AutoMapper;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.Favourites;

namespace ProductsMicroservice.Mappers
{
    public class FavouritesProfile : Profile
    {
        public FavouritesProfile()
        {
            CreateMap<FavouriteDocument, Favourite>();
        }
    }
}
