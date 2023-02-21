using Microsoft.Azure.Cosmos;
using tomas_breakfast.Models;

namespace tomas_breakfast.Repositories
{
    public class StaffRepository : Repository<StaffEntity>
    {
        protected override string ContainerName => "Staff";
        protected override string PartitionKey => "id";

        public StaffRepository(CosmosClient client) : base(client)
        {
            //
        }
    }
}
