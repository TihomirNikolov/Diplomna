using AutoMapper;
using PaymentsMicroservice.Models.Database;
using PaymentsMicroservice.Models.DTOs;

namespace PaymentsMicroservice.Mappers
{
    public class CardProfile : Profile
    {
        public CardProfile() 
        {
            CreateMap<Card, CardDTO>().ReverseMap();
        }
    }
}
