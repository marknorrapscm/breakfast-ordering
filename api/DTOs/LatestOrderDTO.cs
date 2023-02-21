using System.Collections.Generic;

namespace tomas_breakfast.DTOs
{
    public class LatestOrderDTO
    {
        public string orderDayId { get; set; }
        public string date { get; set; }
        public string cutoffTime { get; set; }
        public List<OrderDTO> orders { get; set; }
    }
}
