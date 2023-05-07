using AutoMapper;
using UserMicroservice.Authentication.Models.Database;
using UserMicroservice.Authentication.Models.Responses;

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
