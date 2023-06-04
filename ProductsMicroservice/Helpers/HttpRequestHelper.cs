using Amazon.Runtime.Internal;

namespace ProductsMicroservice.Helpers
{
    public class HttpRequestHelper
    {
        private readonly HttpClient _client;

        public HttpRequestHelper(HttpClient client)
        {
            _client = client;
        }

        public async Task<string> GetUserEmailAsync(string token)
        {
            HttpClientHandler clientHandler = new HttpClientHandler();
            clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

            var httpClient = new HttpClient(clientHandler);

            var response = await httpClient.GetAsync("https://host.docker.internal:44318/api/authenticate/get-user-email/" + token);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var email = await response.Content.ReadAsStringAsync();

            return email;
        }
    }
}
