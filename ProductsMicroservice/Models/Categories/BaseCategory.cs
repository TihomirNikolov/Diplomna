using SharedResources.Models;

namespace ProductsMicroservice.Models.Categories
{
    public class BaseCategory
    {
        public List<Item<string, string>> DisplayName { get; set; } = default!;
        public string UrlPath { get; set; } = string.Empty;
    }
}
