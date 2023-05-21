namespace ProductsMicroservice.Models.Products
{
    public class ProductReview
    {
        public decimal Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
    }
}
