using Newtonsoft.Json;

namespace tomas_breakfast.Models
{
    public class MenuItemEntity
    {
        [JsonProperty(PropertyName = "id")]
        public string item { get; set; }
    }
}
