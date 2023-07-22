namespace ProductsMicroservice.Models.Categories
{
    public class Category : BaseCategory
    {
        public string? Icon { get; set; }
        public string CategoryId { get; set; } = Guid.NewGuid().ToString();
        public string? ParentCategoryId { get; set; } = string.Empty;
        public List<Item<string, List<string>>> Tags { get; set; } = default!;
    }
}
