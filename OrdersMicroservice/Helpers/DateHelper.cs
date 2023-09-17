using System.Globalization;

namespace OrdersMicroservice.Helpers
{
    public static class DateHelper
    {
        public static List<string> GenerateListOfAllMonths()
        { 
            var dateFormatInfo = CultureInfo.GetCultureInfo("en-US").DateTimeFormat;

            var months = dateFormatInfo.MonthNames.Where(m => !string.IsNullOrEmpty(m)).ToList();

            return months;
        }
    }
}
