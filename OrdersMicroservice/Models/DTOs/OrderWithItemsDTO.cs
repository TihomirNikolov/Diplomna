using SharedResources.Models;

namespace OrdersMicroservice.Models.DTOs
{
    public class OrderWithItemsDTO : OrderDTO
    {
        public List<FullOrderItemDTO> OrderItems { get; set; } = default!;
        public AddressDTO Address { get; set; } = default!;
    }
}
