using tomas_breakfast.Models;
using System.Collections.Generic;

namespace tomas_breakfast.DTOs
{
    public class ConfigDTO
    {
        public List<StaffEntity> staff { get; set; }
        public List<MenuItemEntity> menuItems { get; set; }
    }
}
