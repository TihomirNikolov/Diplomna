using AutoMapper;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.Products;
using SharedResources.Models;

namespace ProductsMicroservice.Mappers
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<Product, ProductDocument>();
            CreateMap<ProductDocument, ProductDTO>();
            CreateMap<ProductDocument, CoverProductDTO>()
                .ForMember(c => c.Comments, p => p.MapFrom(pd => pd.Reviews != null ? pd.Reviews.Count : 0))
                .ForMember(c => c.Rating, p => p.MapFrom(pd => pd.Reviews != null && pd.Reviews.Count > 0
                ? pd.Reviews.Sum(r => r.Rating) / pd.Reviews.Count : 0));
            CreateMap<ProductDTO, ProductDocument>();
            CreateMap<CoverProductDTO, ProductDocument>();
            CreateMap<ProductDocument, SearchProductDTO>().ReverseMap();
            CreateMap<ProductDocument, ShoppingCartItemDTO>()
                .ForMember(s => s.ImageUrl, p => p.MapFrom(pd => pd.CoverImageUrl))
                .ReverseMap();
        }
    }
}
