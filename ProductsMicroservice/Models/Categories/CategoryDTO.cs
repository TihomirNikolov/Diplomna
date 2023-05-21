namespace ProductsMicroservice.Models.Categories
{
    public class CategoryDTO : Category
    {
        public List<CategoryDTO>? SubCategories { get; set; }
    }
}
