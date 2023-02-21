using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tomas_breakfast.Repositories
{
    public abstract class Repository<T> where T : class
    {
        protected abstract string ContainerName { get; }
        protected abstract string PartitionKey { get; }
        protected Container Container { get; set; }

        public Repository(CosmosClient client)
        {
            Container = client.GetDatabase("Breakfast").GetContainer(ContainerName);
        }

        public async Task<List<T>> GetAll()
        {
            var query = new QueryDefinition($"SELECT * FROM c");
            var res = await Get(query);

            return res;
        }

        public async Task<T> GetById(string id)
        {
            var query = new QueryDefinition($"SELECT * FROM c WHERE CONTAINS(c.{PartitionKey}, @id)").WithParameter("@id", id);
            var res = await Get(query);

            return res.First();
        }

        public async Task<List<T>> Get(QueryDefinition query)
        {

            var res = new List<T>();

            try
            {
                using (var iterator = Container.GetItemQueryIterator<T>(query))
                {
                    while (iterator.HasMoreResults)
                    {
                        var nextItem = await iterator.ReadNextAsync();
                        var item = nextItem.ToList();
                        res.AddRange(item);
                    }
                }
            }
            catch (Exception ex)
            {
                //
            }

            return res;
        }

        public async Task<bool> Add(List<T> items)
        {
            try
            {
                var tasks = new List<Task>(items.Count);

                foreach (var item in items)
                {
                    tasks.Add(Container.UpsertItemAsync(item));
                }

                await Task.WhenAll(tasks);
            }
            catch (Exception ex)
            {
                //
            }

            return true;
        }

        public async Task<bool> Add(T item)
        {
            var list = new List<T>() { item };

            return await Add(list);
        }
    }
}
