using SharedResources.Models;

namespace ProductsMicroservice.Models.DTOs
{
    public class OrderItemDTO
    {
        public string ProductId { get; set; } = string.Empty;
        public List<Item<string, string>> Name { get; set; } = default!;
        public string ImageUrl { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
    }
}
