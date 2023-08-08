using AutoMapper;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.Stores;

namespace ProductsMicroservice.Mappers
{
    public class StoreProfile : Profile
    {
        public StoreProfile() 
        {
            CreateMap<Store, StoreDocument>().ReverseMap();
            CreateMap<StoreDTO, StoreDocument>().ReverseMap();
        }
    }
}
