using ProductsMicroservice.Models.Utilities;

namespace ProductsMicroservice.Models.Requests
{
    public class GetProductsByCategoryRequest
    {
        public List<CheckedFilter>? CheckedFilters { get; set; }

        public string SortingType { get; set; } = string.Empty;
    }
}
