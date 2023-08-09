﻿using SharedResources.Models;

namespace ProductsMicroservice.Models.Products
{
    public class ProductDTOBase
    {
        public string Id { get; set; } = string.Empty;
        public List<Item<string, string>> Name { get; set; } = default!;
        public string ProductUrl { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public decimal Price { get; set; } = decimal.Zero;
        public string StoreId { get; set; } = string.Empty;
        public int StoreCount { get; set; } = 0;
        public List<Item<string, List<Item<string, string>>>> CoverTags { get; set; } = default!;
    }
}