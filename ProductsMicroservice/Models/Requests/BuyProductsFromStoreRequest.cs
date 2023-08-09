using ProductsMicroservice.Models.DTOs;

namespace ProductsMicroservice.Models.Requests
{
    public class BuyProductsFromStoreRequest
    {
        public List<StoreProductDTO> StoreProducts { get; set; } = default!;
    }
}
