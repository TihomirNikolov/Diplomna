namespace PaymentsMicroservice.Models.Database
{
    public class Card
    {
        public string Id { get; set; }

        public string Last4 { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string CardId { get; set; } = string.Empty;

        public string CustomerId { get; set; } = string.Empty;

        public Customer Customer { get; set; } = default!;

        public Card()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
