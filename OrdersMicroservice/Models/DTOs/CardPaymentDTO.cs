namespace OrdersMicroservice.Models.DTOs
{
    public class CardPaymentDTO
    {
        public string CardId { get; set; } = string.Empty;

        public CardDTO NewCard { get; set; } = default!;

        public bool IsPaymentWithNewCard { get; set; }
    }
}
