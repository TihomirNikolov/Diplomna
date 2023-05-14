using AutoMapper;
using UserMicroservice.Models.Database;
using UserMicroservice.Models.Responses;

namespace UserMicroservice.Mappers
{
    public class RefreshTokenProfile : Profile
    {
        public RefreshTokenProfile()
        {
            CreateMap<RefreshToken, RefreshTokenDTO>();
        }
    }
}
