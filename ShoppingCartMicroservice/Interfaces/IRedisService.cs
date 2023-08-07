using ShoppingCartMicroservice.Models;

namespace ShoppingCartMicroservice.Interfaces
{
    public interface IRedisService
    {
        Task<List<ShoppingCartItem>> AddItemToShoppingCartByEmailAsync(string email, string productId, int number);
        Task<List<ShoppingCartItem>> AddItemToShoppingCartByBrowserIdAsync(string browserId, string productId, int number);
        Task<List<ShoppingCartItem>> UpdateItemToShoppingCartByEmailAsync(string email, string productId, int number);
        Task<List<ShoppingCartItem>> UpdateItemToShoppingCartByBrowserIdAsync(string browserId, string productId, int number);
        Task<List<ShoppingCartItem>> DeleteShoppingCartItemByEmailAsync(string email, string productId);
        Task<List<ShoppingCartItem>> DeleteShoppingCartItemByBrowserIdAsync(string browserId, string productId);
        Task<List<ShoppingCartItem>> DeleteShoppingCartByEmailAsync(string email);
        Task<List<ShoppingCartItem>> DeleteShoppingCartByBrowserIdAsync(string browserId);
    }
}
