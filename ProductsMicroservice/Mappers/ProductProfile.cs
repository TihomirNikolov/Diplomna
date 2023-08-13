using AutoMapper;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.DTOs;
using ProductsMicroservice.Models.Products;
using SharedResources.Models;

namespace ProductsMicroservice.Mappers
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<Product, ProductDocument>();
            CreateMap<ProductDocument, ProductDTO>()
                .ForMember(p => p.IsNew, p => p.MapFrom(pd => (DateTime.Now - pd.AddedDate).TotalDays <= 14));
            CreateMap<ProductDocument, CoverProductDTO>()
                .ForMember(c => c.Comments, p => p.MapFrom(pd => pd.Reviews != null ? pd.Reviews.Count : 0))
                .ForMember(c => c.Rating, p => p.MapFrom(pd => pd.Reviews != null && pd.Reviews.Count > 0
                ? pd.Reviews.Sum(r => r.Rating) / pd.Reviews.Count : 0))
                .ForMember(p => p.IsNew, p => p.MapFrom(pd => (DateTime.Now - pd.AddedDate).TotalDays <= 14));
            CreateMap<ProductDTO, ProductDocument>();
            CreateMap<CoverProductDTO, ProductDocument>();
            CreateMap<ProductDocument, SearchProductDTO>()
                .ForMember(p => p.IsNew, p => p.MapFrom(pd => (DateTime.Now - pd.AddedDate).TotalDays <= 14))
                .ReverseMap();
            CreateMap<ProductDocument, ShoppingCartItemDTO>()
                .ForMember(s => s.ImageUrl, p => p.MapFrom(pd => pd.CoverImageUrl))
                .ForMember(s => s.ProductId, p => p.MapFrom(pd => pd.Id))
                .ReverseMap();
        }
    }
}
