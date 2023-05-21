using AutoMapper;
using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.Documents;

namespace ProductsMicroservice.Mappers
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile() 
        {
            CreateMap<CategoryDocument, Category>();
            CreateMap<Category,CategoryDTO>();
        }
    }
}
