using AuthMicroservice.Authentication.Models.Database;
using AuthMicroservice.Authentication.Models.Responses;
using AutoMapper;

namespace AuthMicroservice.Mappers
{
    public class RefreshTokenProfile : Profile
    {
        public RefreshTokenProfile()
        {
            CreateMap<RefreshToken, RefreshTokenDTO>();
        }
    }
}
