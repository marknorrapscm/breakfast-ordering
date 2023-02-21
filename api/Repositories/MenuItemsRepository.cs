using Microsoft.Azure.Cosmos;
using tomas_breakfast.Models;

namespace tomas_breakfast.Repositories
{
    public class MenuItemsRepository : Repository<MenuItemEntity>
    {
        protected override string ContainerName => "MenuItems";
        protected override string PartitionKey => "id";

        public MenuItemsRepository(CosmosClient client) : base(client)
        {
            //
        }
    }
}
