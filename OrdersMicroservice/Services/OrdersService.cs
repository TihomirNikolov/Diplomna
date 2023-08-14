using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OrdersMicroservice.Interfaces;
using OrdersMicroservice.Models;
using OrdersMicroservice.Models.Database;
using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Services
{
    public class OrdersService : IOrdersService
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly IHttpService _httpService;

        private readonly IMapper _mapper;

        public OrdersService(ApplicationDbContext dbContext,
                             IHttpService httpService,
                             IMapper mapper)
        {
            _dbContext = dbContext;
            _httpService = httpService;
            _mapper = mapper;
        }

        public async Task<string> CreateOrderAsync(string uniqueId, List<OrderItemDTO> orderItems, AddressDTO address, string comment, CardPaymentDTO cardPayment)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            var mappedItems = _mapper.Map<List<OrderItem>>(orderItems);
            var mappedAddress = _mapper.Map<Address>(address);
            try
            {
                var order = new Order
                {
                    OrderItems = mappedItems,
                    UniqueId = uniqueId,
                    Comment = comment,
                    Status = OrderStatusEnum.New,
                    Address = mappedAddress,
                    OrderDate= DateTime.Now
                };

                decimal sum = 0;

                foreach (var item in mappedItems)
                {
                    decimal.TryParse(item.Sum, out var itemSum);
                    sum += itemSum;
                }

                order.OrderSum = sum.ToString();

                var savedOrder = await _dbContext.Orders.AddAsync(order);
                await _dbContext.SaveChangesAsync();

                var response = await _httpService.BuyProductsAsync(_mapper.Map<List<StoreProductDTO>>(orderItems));

                if (!response)
                {
                    await transaction.RollbackAsync();
                    return "";
                }

                if (cardPayment.IsPaymentWithNewCard)
                {
                    var result = await _httpService.CreatePaymentWithNewCardAsync(savedOrder.Entity.Id, cardPayment.NewCard, sum.ToString());

                    if (!result)
                    {
                        await transaction.RollbackAsync();
                        return "";
                    }
                }
                else
                {
                    var result = await _httpService.CreatePaymentAsync(savedOrder.Entity.Id, cardPayment.CardId, sum.ToString());

                    if (!result)
                    {
                        await transaction.RollbackAsync();
                        return "";
                    }
                }

                await transaction.CommitAsync();
                return savedOrder.Entity.Id;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();

                return "";
            }
        }

        public async Task<List<OrderDTO>> GetOrdersAsync(string id)
        {
            var orders = await _dbContext.Orders.Include(o => o.OrderItems).Include(o => o.Address).Where(o => o.UniqueId.ToLower() == id.ToLower()).ToListAsync();

            return _mapper.Map<List<OrderDTO>>(orders);
        }

        public async Task<OrderWithItemsDTO?> GetOrderByIdAsync(string id)
        {
            var order = await _dbContext.Orders.Include(o => o.OrderItems).Include(o => o.Address).FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return null;

            var orderItems = await _httpService.GetOrderItemsAsync(order.OrderItems.Select(o => o.ProductId).ToList());

            if (orderItems == null)
                return null;

            var mappedOrder = _mapper.Map<OrderWithItemsDTO>(order);

            foreach(var item in orderItems)
            {
                var mappedItem = mappedOrder.OrderItems.FirstOrDefault(o => o.ProductId == item.ProductId);

                if (mappedItem == null)
                    continue;

                mappedItem.ProductId = item.ProductId;
                mappedItem.Name = item.Name;
                mappedItem.ImageUrl = item.ImageUrl;
            }

            return mappedOrder;
        }
    }
}
