namespace ProductsMicroservice.Models.Products
{
    public class ProductReview
    {
        public string Id { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; } = DateTime.Now;
        public string AvatarColor { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
    }
}
