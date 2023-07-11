using System.Net.Http.Headers;
using UserMicroservice.Helpers.Constants;
using UserMicroservice.Interfaces.Helpers;

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
                accessToken = headerValue.Parameter!;
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

        public static string GetEmailFromRequest(this HttpRequest request, IAuthenticationHelper authHelper)
        {
            var accessToken = GetAuthorizationToken(request);
            if (accessToken == null)
            {
                return string.Empty;
            }

            var principal = authHelper.GetPrincipalFromToken(accessToken);
            if (principal == null || principal.Identity == null || string.IsNullOrEmpty(principal.Identity.Name))
            {
                return string.Empty;
            }

            string email = principal.Identity.Name;

            return email;
        }

        #endregion
    }
}
