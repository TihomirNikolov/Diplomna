namespace ProductsMicroservice.Models.Requests
{
    public class GetByProductUrlsRequest
    {
        public List<string> ProductUrls { get; set; } = default!;
    }
}
