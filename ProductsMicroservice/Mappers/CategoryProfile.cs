using AutoMapper;
using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.DTOs;

namespace ProductsMicroservice.Mappers
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile() 
        {
            CreateMap<CategoryDocument, Category>();
            CreateMap<Category,CategoryDTO>();
            CreateMap<CategoryDocument, SearchCategoryDTO>();
            CreateMap<SearchCategoryDTO, SearchCategoryWithProductsDTO>().ReverseMap();
            CreateMap<CategoryDTO, CategoryDocument>();
        }
    }
}
