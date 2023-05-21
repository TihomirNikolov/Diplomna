using AutoMapper;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.Products;

namespace ProductsMicroservice.Mappers
{
    public class ProductProfile : Profile
    {
        public ProductProfile() 
        {
            CreateMap<Product, ProductDocument>();
            CreateMap<ProductDocument, ProductDTO>();
            CreateMap<ProductDocument, CoverProductDTO>();
            CreateMap<ProductDTO, ProductDocument>();
            CreateMap<CoverProductDTO, ProductDocument>();
        }
    }
}
