using SharedResources.Models;

namespace ProductsMicroservice.Models.DTOs
{
    public class SearchProductDTO : ProductDTOBase
    {
        public List<Item<string, string>> Description { get; set; } = default!;
    }
}
