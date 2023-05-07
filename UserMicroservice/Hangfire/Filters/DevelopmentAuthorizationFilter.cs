using Hangfire.Dashboard;

namespace UserMicroservice.Hangfire.Filters
{
    public class DevelopmentAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {

            return true;
        }
    }
}
