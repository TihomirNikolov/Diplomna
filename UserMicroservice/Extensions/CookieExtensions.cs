namespace UserMicroservice.Extensions
{
    public static class CookieExtensions
    {
        public static void AppendDefaultCookie(this IResponseCookies cookies, string cookieName, string cookieValue, int cookieLifespan = 30)
        {
            cookies.Append(cookieName, cookieValue, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Domain = "192.168.0.133",
                Expires = DateTime.Now.AddDays(cookieLifespan)
            });
        }
    }
}
