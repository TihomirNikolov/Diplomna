using ProductsMicroservice.Models.DTOs;

namespace ProductsMicroservice.Models.Responses
{
    public class CoverProductsResponse
    {
        public List<CoverProductDTO> Products { get; set; } = default!;

        public long Count { get; set; }
    }
}
