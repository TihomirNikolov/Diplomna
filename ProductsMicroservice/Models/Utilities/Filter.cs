using SharedResources.Models;

namespace ProductsMicroservice.Models.Utilities
{
    public class CheckedFilter
    {
        public string Key { get; set; } = string.Empty;
        public List<string> Values { get; set; } = default!;
    }

    public class Filter
    {
        public List<Item<List<Item<string, string>>, FilterValue>> Values { get; set; } = default!;
    }

    public class FilterValue
    {
        public int Count { get; set; }
        public bool IsChecked { get; set; }
    }
}
