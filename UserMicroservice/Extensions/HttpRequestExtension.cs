using System.Net.Http.Headers;
using UserMicroservice.Helpers.Constants;

namespace UserMicroservice.Extensions
{
    public static class HttpRequestExtension
    {
        #region Methods

        public static string GetAuthorizationToken(this HttpRequest request)
        {
            string accessToken = "";

            var refreshTokenHeader = request.Headers[HeaderConstants.Authorization].ToString();

            if (!string.IsNullOrEmpty(refreshTokenHeader))
            {
                AuthenticationHeaderValue.TryParse(refreshTokenHeader, out var headerValue);
                accessToken = headerValue.Parameter;
            }
            else
            {
                var authorizationCookie = request.Cookies[CookieConstants.AccessToken];
                if (authorizationCookie != null && !string.IsNullOrEmpty(authorizationCookie))
                {
                    accessToken = authorizationCookie.Replace("Bearer ", "");
                }
            }

            return accessToken;
        }

        public static string GetRefreshToken(this HttpRequest request)
        {
            string refreshToken = "";

            var refreshTokenHeader = request.Headers[HeaderConstants.RefreshToken].ToString();

            if (!string.IsNullOrEmpty(refreshTokenHeader))
            {
                refreshToken = refreshTokenHeader;
            }
            else
            {
                var authorizationCookie = request.Cookies[CookieConstants.RefreshToken];
                if (authorizationCookie != null && !string.IsNullOrEmpty(authorizationCookie))
                {
                    refreshToken = authorizationCookie;
                }
            }

            return refreshToken;
        }

        #endregion
    }
}
