using AutoMapper;
using OrdersMicroservice.Models.Database;
using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Mappers
{
    public class AddressProfile : Profile
    {
        public AddressProfile() 
        {
            CreateMap<Address, AddressDTO>().ReverseMap();
        }
    }
}
