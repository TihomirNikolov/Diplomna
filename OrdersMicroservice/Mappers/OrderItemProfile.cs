using AutoMapper;
using OrdersMicroservice.Models.Database;
using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Mappers
{
    public class OrderItemProfile : Profile
    {
        public OrderItemProfile() 
        {
            CreateMap<OrderItem, OrderItemDTO>().ReverseMap();
            CreateMap<OrderItemDTO, StoreProductDTO>().ReverseMap();
        }
    }
}
