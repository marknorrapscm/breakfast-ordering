using Microsoft.AspNetCore.Http;
using System;
using System.Globalization;

namespace tomas_breakfast.Models
{
    public class OrderDayEntity
    {
        public string id { get; set; }
        public string date { get; set; }
        public string cutoffTime { get; set; } = "09:30";
        public DateTime dateAsDate
        {
            get
            {
                return DateTime.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            }
        }
    }
}
