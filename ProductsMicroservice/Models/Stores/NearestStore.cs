namespace ProductsMicroservice.Models.Stores
{
    public class NearestStore
    {
        public StoreDTO Store { get; set; } = default!;

        public double Coefficient { get; set; }
    }
}
