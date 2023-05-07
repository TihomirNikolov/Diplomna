using Hangfire;

namespace UserMicroservice.Authentication.Helpers
{
    public class HangfireHelper
    {
        public void DeleteJobByArgument(string argument)
        {
            var jobs = JobStorage.Current.GetMonitoringApi().ScheduledJobs(0, Convert.ToInt32(JobStorage.Current.GetMonitoringApi().ScheduledCount()));
            var job = jobs.Where(j => j.Value.Job.Args.Contains(argument)).FirstOrDefault();

            if (job.Value != null)
            {
                BackgroundJob.Delete(job.Key);
            }
        }
    }
}
