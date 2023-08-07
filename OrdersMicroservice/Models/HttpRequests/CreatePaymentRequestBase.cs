namespace OrdersMicroservice.Models.HttpRequests
{
    public class CreatePaymentRequestBase
    {
        public string OrderId { get; set; } = string.Empty;

        public string Amount { get; set; } = string.Empty;
    }
}
