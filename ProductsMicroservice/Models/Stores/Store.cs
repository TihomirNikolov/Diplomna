using SharedResources.Models;

namespace ProductsMicroservice.Models.Stores
{
    public class Store
    {
        public List<Item<string, string>> Name { get; set; } = default!;

        public List<Item<string, string>> Description { get; set; } = default!;

        public Location Location { get; set; } = default!;
    }
}
