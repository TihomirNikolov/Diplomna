namespace ProductsMicroservice.Models.Categories
{
    public class SearchCategoryDTO
    {
        public List<Item<string, string>> DisplayName { get; set; } = default!;
        public string UrlPath { get; set; } = string.Empty;
    }
}
