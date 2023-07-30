using ShoppingCartMicroservice.Models;

namespace ShoppingCartMicroservice.Interfaces
{
    public interface IShoppingCartService
    {
        Task<List<ShoppingCartItem>> GetShoppingCartByEmailAsync(string email);
        Task<List<ShoppingCartItem>> GetShoppingCartByBrowserIdAsync(string browserId);
    }
}
