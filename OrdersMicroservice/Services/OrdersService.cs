using AutoMapper;
using OrdersMicroservice.Interfaces;
using OrdersMicroservice.Models;
using OrdersMicroservice.Models.Database;
using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Services
{
    public class OrdersService : IOrdersService
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly IMapper _mapper;

        public OrdersService(ApplicationDbContext dbContext,
                             IMapper mapper)
        { 
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<string> CreateOrderAsync(string uniqueId, List<OrderItemDTO> orderItems, string comment)
        {
            var mappedItems = _mapper.Map<List<OrderItem>>(orderItems);

            var order = new Order();

            order.OrderItems = mappedItems;
            order.UniqueId = uniqueId;
            order.Comment = comment;
            order.Status = OrderStatusEnum.New;

            decimal sum = 0;

            foreach (var item in mappedItems)
            {
                decimal.TryParse(item.Sum, out var itemSum);
                sum += itemSum;
            }

            order.OrderSum = sum.ToString();

            var savedOrder = await _dbContext.Orders.AddAsync(order);
            await _dbContext.SaveChangesAsync();

            return savedOrder.Entity.Id;
        }
    }
}
