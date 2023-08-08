using ProductsMicroservice.Models.Stores;

namespace ProductsMicroservice.Helpers
{
    public static class LocationHelper
    {
        public static NearestStore GetNearestStore(this List<StoreDTO> stores, string userLatitude, string userLongitude)
        {
            List<double> distances = new List<double>();
            foreach (var store in stores)
            {
                distances.Add(CalculateDistance(store.Location.Latitude, store.Location.Longitude, userLatitude, userLongitude));
            }

            var minDistance = distances.Min();
            var index = distances.IndexOf(minDistance);

            return new NearestStore { Store = stores[index], Coefficient = minDistance / 10000 };
        }

        public static double CalculateDistance(string latitude1, string longitude1, string latitude2, string longitude2)
        {
            double.TryParse(latitude1, out var parsedLatitude1);
            double.TryParse(latitude2, out var parsedLatitude2);
            double.TryParse(longitude1, out var parsedLongitude1);
            double.TryParse(longitude2, out var parsedLongitude2);

            double rlat1 = Math.PI * parsedLatitude1 / 180;
            double rlat2 = Math.PI * parsedLatitude2 / 180;
            double theta = parsedLongitude1 - parsedLongitude2;
            double rtheta = Math.PI * theta / 180;
            double dist =
                Math.Sin(rlat1) * Math.Sin(rlat2) + Math.Cos(rlat1) *
                Math.Cos(rlat2) * Math.Cos(rtheta);
            dist = Math.Acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;

            return dist * 1.609344;
        }
    }
}
