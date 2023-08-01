namespace PaymentsMicroservice.Models.Database
{
    public class Customer
    {
        public string Id { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string CutomerId { get; set; } = string.Empty;

        public List<Payment> Payments { get; set; } = default!;

        public Customer() 
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
