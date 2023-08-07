namespace PaymentsMicroservice.Models.Database
{
    public class Payment
    {
        public string Id { get; set; }

        public decimal Amount { get; set; }

        public DateTime DateOfPayment { get; set; }

        public string OrderId { get; set; } = string.Empty;

        public string PaymentId { get; set; } = string.Empty;

        public Card Card { get; set; } = default!;

        public string CardId { get; set; } = string.Empty;

        public Payment()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
