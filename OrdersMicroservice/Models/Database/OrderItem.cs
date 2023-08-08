namespace OrdersMicroservice.Models.Database
{
    public class OrderItem
    {
        public int Id { get; set; }

        public string ProductId { get; set; } = string.Empty;

        public string StoreId { get; set; } = string.Empty;

        public string Count { get; set; } = string.Empty;

        public string Sum { get; set; } = string.Empty;

        public Order Order { get; set; } = default!;

        public string OrderId { get; set; } = string.Empty;
    }
}
