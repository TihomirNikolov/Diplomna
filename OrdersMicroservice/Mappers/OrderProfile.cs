using AutoMapper;
using OrdersMicroservice.Models.Database;
using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Mappers
{
    public class OrderProfile : Profile
    {
        public OrderProfile() 
        {
            CreateMap<Order, OrderDTO>().ReverseMap();
            CreateMap<Order, OrderWithItemsDTO>().ReverseMap();
        }
    }
}
