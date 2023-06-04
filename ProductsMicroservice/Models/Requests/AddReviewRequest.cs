using ProductsMicroservice.Models.Products;

namespace ProductsMicroservice.Models.Requests
{
    public class AddReviewRequest
    {
        public ProductReview Review { get; set; } = default!;
        public string ProductUrl { get; set; } = string.Empty;
    }
}
