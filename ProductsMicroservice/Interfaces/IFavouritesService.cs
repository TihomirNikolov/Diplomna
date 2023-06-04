using ProductsMicroservice.Models.Favourites;

namespace ProductsMicroservice.Interfaces
{
    public interface IFavouritesService
    {
        Task AddFavourite(string email, string favoriteName);
        Task RemoveFavourite(string email, string favouriteName);
        Task<List<string>> GetFavouritesByEmail(string email);
    }
}
