using OrdersMicroservice.Models.DTOs;

namespace OrdersMicroservice.Models.HttpRequests
{
    public class CreatePaymentNewCardRequest : CreatePaymentRequestBase
    {
        public CardDTO NewCard { get; set; } = default!;
    }
}
