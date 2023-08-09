using ProductsMicroservice.Models.DTOs;

namespace ProductsMicroservice.Models.Requests
{
    public class AddProductToStoreRequest
    {
        public StoreProductDTO StoreProduct { get; set; } = default!;
    }
}
