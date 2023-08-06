﻿namespace SharedResources.Models
{
    public class ShoppingCartItemDTO
    {
        public List<Item<string, string>> Name { get; set; } = default!;
        public List<Item<string, List<Item<string, string>>>> CoverTags { get; set; } = default!;
        public decimal Price { get; set; }
        public string ImageUrl { get;set;} = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
        public string ProductId { get; set; } = string.Empty;

    }
}
