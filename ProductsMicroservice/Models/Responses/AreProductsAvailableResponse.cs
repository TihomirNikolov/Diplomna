namespace ProductsMicroservice.Models.Responses
{
    public class AreProductsAvailableResponse
    {
        public List<UnavailableProduct> UnavailableProducts { get; set; } = default!;

        public bool IsSuccessful { get; set; }
    }
}
