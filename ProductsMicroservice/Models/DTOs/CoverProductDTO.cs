using SharedResources.Models;

namespace ProductsMicroservice.Models.DTOs
{
    public class CoverProductDTO : ProductDTOBase
    {
        public DateTime AddedDate { get; set; }
        public List<Item<string, List<Item<string, string>>>> Tags { get; set; } = default!;
        public decimal Rating { get; set; }
        public decimal Comments { get; set; }
        public int SoldAmount { get; set; }
    }
}
