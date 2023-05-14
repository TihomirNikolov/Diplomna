using AutoMapper;
using UserMicroservice.Models.Database;
using UserMicroservice.Models.Requests;

namespace UserMicroservice.Mappers
{
    public class AddressProfile : Profile
    {
        public AddressProfile()
        {
            CreateMap<AddAddressRequest, Address>();
            CreateMap<EditAddressRequest, Address>();
        }
    }
}
