namespace PaymentsMicroservice.Models.DTOs
{
    public class CardDTO
    {
        public string Id { get; set; } = string.Empty;

        public string Last4 { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;
    }
}
