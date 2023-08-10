using ProductsMicroservice.Models.DTOs;

namespace ProductsMicroservice.Models.Requests
{
    public class AreProductsAvailableRequest
    {
        public List<StoreProductDTO> StoreProducts { get; set; } = default!;
    }
}
