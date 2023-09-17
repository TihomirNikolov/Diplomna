using AutoMapper;
using UserMicroservice.Models.Database;
using UserMicroservice.Models.Responses;

namespace UserMicroservice.Mappers
{
    public class UserProfile : Profile
    {
        public UserProfile() 
        {
            CreateMap<ApplicationUser, UserDTO>()
                .ForMember(u => u.Name, u => u.MapFrom(user => user.UserInfo.FirstName + " " + user.UserInfo.LastName));
        }
    }
}
