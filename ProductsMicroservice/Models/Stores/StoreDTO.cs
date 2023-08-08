﻿using SharedResources.Models;

namespace ProductsMicroservice.Models.Stores
{
    public class StoreDTO
    {
        public string Id { get; set; } = string.Empty;

        public List<Item<string, string>> Name { get; set; } = default!;

        public List<Item<string, string>> Description { get; set; } = default!;

        public Location Location { get; set; } = default!;

    }
}
