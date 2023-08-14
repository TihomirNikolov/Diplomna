using SharedResources.Models;

namespace OrdersMicroservice.Models.DTOs
{
    public class FullOrderItemDTO
    {
        public string ProductId { get; set; } = string.Empty;
        public List<Item<string, string>> Name { get; set; } = default!;
        public string ImageUrl { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
        public string Count { get; set; } = string.Empty;
        public string Sum { get; set; } = string.Empty;
    }
}
