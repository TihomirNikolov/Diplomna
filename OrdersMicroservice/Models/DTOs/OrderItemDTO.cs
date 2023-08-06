namespace OrdersMicroservice.Models.DTOs
{
    public class OrderItemDTO
    {
        public string ProductId { get; set; } = string.Empty;

        public string Count { get; set; } = string.Empty;

        public string Sum { get; set; } = string.Empty;
    }
}
