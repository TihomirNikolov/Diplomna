namespace UserMicroservice.Models.Responses
{
    public class RefreshTokenDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string DeviceType { get; set; } = string.Empty;
        public DateTime CreatedTime { get; set; } = DateTime.Now;
    }
}
