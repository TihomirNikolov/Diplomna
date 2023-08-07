namespace PaymentsMicroservice.Models.Requests
{
    public class CreatePaymentNewCardRequest : CreatePaymentRequestBase
    {
        public AddCardRequest NewCard { get; set; } = default!;
    }
}
