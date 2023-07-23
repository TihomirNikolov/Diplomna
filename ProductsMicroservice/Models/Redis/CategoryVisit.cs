namespace ProductsMicroservice.Models.Redis
{
    public class CategoryVisit
    {
        public string CategoryUrl { get; set; } = string.Empty;
        public List<DateTime> DateTimes { get; set; } = default!;
    }
}
