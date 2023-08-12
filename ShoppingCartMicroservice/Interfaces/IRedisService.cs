using ShoppingCartMicroservice.Models;

namespace ShoppingCartMicroservice.Interfaces
{
    public interface IRedisService
    {
        Task AddItemToShoppingCartByEmailAsync(string email, string productId, int number);
        Task AddItemToShoppingCartByBrowserIdAsync(string browserId, string productId, int number);
        Task UpdateItemToShoppingCartByEmailAsync(string email, string productId, int number);
        Task UpdateItemToShoppingCartByBrowserIdAsync(string browserId, string productId, int number);
        Task RemoveShoppingCartItemByEmailAsync(string email, string productId);
        Task RemoveShoppingCartItemByBrowserIdAsync(string browserId, string productId);
        Task DeleteShoppingCartByEmailAsync(string email);
        Task DeleteShoppingCartByBrowserIdAsync(string browserId);
    }
}
