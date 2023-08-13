using ProductsMicroservice.Models.Categories;

namespace ProductsMicroservice.Models.DTOs
{
    public class SearchCategoryWithProductsDTO : SearchCategoryDTO
    {
        public List<CoverProductDTO> Products { get; set; } = default!;
    }
}
