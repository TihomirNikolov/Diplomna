namespace OrdersMicroservice.Models.HttpRequests
{
    public class CreatePaymentExistingCardRequest : CreatePaymentRequestBase
    {
        public string CardId { get; set; } = string.Empty;
    }
}
