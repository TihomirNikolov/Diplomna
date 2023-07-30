using ShoppingCartMicroservice.Models;

namespace ShoppingCartMicroservice.Interfaces
{
    public interface IRedisService
    {
        Task<List<ShoppingCartItem>> AddItemToShoppingCartByEmailAsync(string email, string productUrl, int number);
        Task<List<ShoppingCartItem>> AddItemToShoppingCartByBrowserIdAsync(string browserId, string productUrl, int number);
        Task<List<ShoppingCartItem>> UpdateItemToShoppingCartByEmailAsync(string email, string productUrl, int number);
        Task<List<ShoppingCartItem>> UpdateItemToShoppingCartByBrowserIdAsync(string browserId, string productUrl, int number);
        Task<List<ShoppingCartItem>> DeleteShoppingCartItemByEmailAsync(string email, string productUrl);
        Task<List<ShoppingCartItem>> DeleteShoppingCartItemByBrowserIdAsync(string browserId, string productUrl);
    }
}
