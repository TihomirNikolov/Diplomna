namespace ProductsMicroservice.Models
{
    public class Item<TKey, TValue>
    {
        public TKey Key { get; set; } = default!;
        public TValue Value { get; set; } = default!;
    }
}
