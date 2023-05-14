namespace UserMicroservice.Models.Database
{
    public class ChangeEmailToken : BaseToken
    {
        public string NewEmail { get; set; } = string.Empty;
        public ChangeEmailToken() : base()
        {
        }
    }
}
