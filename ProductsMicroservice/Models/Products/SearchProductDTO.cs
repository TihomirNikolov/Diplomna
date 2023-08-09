using SharedResources.Models;

namespace ProductsMicroservice.Models.Products
{
    public class SearchProductDTO : ProductDTOBase
    {
        public List<Item<string, string>> Description { get; set; } = default!;
    }
}
