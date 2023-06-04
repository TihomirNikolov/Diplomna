namespace ProductsMicroservice.Models.Categories
{
    public class BaseCategory
    {
        public Dictionary<string, string> DisplayName { get; set; } = default!;
        public string UrlPath { get; set; } = string.Empty;
    }
}
