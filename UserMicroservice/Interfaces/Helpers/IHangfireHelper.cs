namespace UserMicroservice.Interfaces.Helpers
{
    public interface IHangfireHelper
    {
        void DeleteJobByArgument(string argument);
    }
}
