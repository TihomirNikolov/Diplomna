namespace ProductsMicroservice.Models.Redis
{
    public class ProductVisit
    {
        public string ProductUrl { get; set; } = string.Empty;
        public List<DateTime> DateTimes { get; set; } = default!;
    }
}
