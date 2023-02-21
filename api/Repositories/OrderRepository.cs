using Microsoft.Azure.Cosmos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using tomas_breakfast.Models;

namespace tomas_breakfast.Repositories
{
    public class OrderRepository : Repository<OrderEntity>
    {
        protected override string ContainerName => "Order";
        protected override string PartitionKey => "id";

        public OrderRepository(CosmosClient client) : base(client)
        {
            //
        }

        public async Task<List<OrderEntity>> GetOrdersForDay(string id)
        {
            var query = new QueryDefinition($"SELECT * FROM c WHERE CONTAINS(c.orderDayId, @id)").WithParameter("@id", id);
            var res = await Get(query);

            return res;
        }

        public async Task<List<OrderEntity>> GetOrderForStaffOnDay(string staffId, string orderDayId)
        {
            var query = new QueryDefinition($"SELECT * FROM c WHERE c.staffId = @staffId AND c.orderDayId = @orderDayId")
                .WithParameter("@staffId", staffId)
                .WithParameter("@orderDayId", orderDayId);

            var res = await Get(query);

            return res;
        }
    }
}
