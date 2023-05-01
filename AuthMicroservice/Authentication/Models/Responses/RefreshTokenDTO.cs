namespace AuthMicroservice.Authentication.Models.Responses
{
    public class RefreshTokenDTO
    {
        public string Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public string DeviceType { get; set; } = string.Empty;
    }
}
