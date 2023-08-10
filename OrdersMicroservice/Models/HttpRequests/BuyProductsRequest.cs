using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Models.HttpRequests
{
    public class BuyProductsRequest
    {
        public List<StoreProductDTO> StoreProducts { get; set; } = default!;
    }
}
