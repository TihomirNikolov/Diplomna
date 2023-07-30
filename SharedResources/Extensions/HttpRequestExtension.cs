using Microsoft.AspNetCore.Http;
using System.Net;
using System.Net.Http.Headers;

namespace SharedResources.Extensions
{
    public static class HttpRequestExtension
    {
        #region Methods

        public static string GetAuthorizationToken(this HttpRequest request)
        {
            string accessToken = "";

            var refreshTokenHeader = request.Headers[HttpRequestHeader.Authorization.ToString()].ToString();

            if (!string.IsNullOrEmpty(refreshTokenHeader))
            {
                AuthenticationHeaderValue.TryParse(refreshTokenHeader, out var headerValue);
                accessToken = headerValue.Parameter;
            }

            return accessToken;
        }

        #endregion
    }
}
