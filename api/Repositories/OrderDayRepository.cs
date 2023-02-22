using Microsoft.Azure.Cosmos;
using System.Linq;
using System.Threading.Tasks;
using tomas_breakfast.Models;

namespace tomas_breakfast.Repositories
{
    public class OrderDayRepository : Repository<OrderDayEntity>
    {
        protected override string ContainerName => "OrderDay";
        protected override string PartitionKey => "id";

        public OrderDayRepository(CosmosClient client) : base(client)
        {
            //
        }

        public async Task<OrderDayEntity> GetForDate(string date)
        {
            var query = new QueryDefinition($"SELECT * FROM c WHERE c.date = @date").WithParameter("@date", date);
            var res = await Get(query);

            return res.First();
        }

        public async Task<OrderDayEntity> GetLatest()
        {
            var query = new QueryDefinition($"SELECT TOP 1 * FROM c ORDER BY c.date DESC");
            var res = await Get(query);

            return res.First();
        }
    }
}

