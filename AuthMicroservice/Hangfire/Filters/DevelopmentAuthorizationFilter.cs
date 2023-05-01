using Hangfire.Dashboard;

namespace AuthMicroservice.Hangfire.Filters
{
    public class DevelopmentAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {

            return true;
        }
    }
}
