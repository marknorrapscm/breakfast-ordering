using System;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using tomas_breakfast.Models;
using tomas_breakfast.Repositories;

namespace tomas_breakfast.Cron
{
    public class AutoCreateNewOrderDay
    {
        // , RunOnStartup = false
        [FunctionName("AutoCreateNewOrderDay")]
        public async Task Run(
            [TimerTrigger("0 0 0 * * WED")] TimerInfo myTimer,
            [CosmosDB(Connection = "CosmosDbConnectionString")] CosmosClient client,
            ILogger log)
        {
            log.LogInformation($"AutoCreateNewOrderDay function executed at: {DateTime.Now}");

            var orderDayRepo = new OrderDayRepository(client);
            var tomorrow = DateTime.Today.AddDays(1);
            var latestOrderDay = await orderDayRepo.GetLatest();

            if (latestOrderDay.dateAsDate == tomorrow)
            {
                log.LogError($"An OrderDay already exists for {tomorrow.ToString("yyyy-MM-dd")}. Nothing extra will be created. This isn't right.");
                return;
            }

            var newOrderDay = new OrderDayEntity();
            newOrderDay.date = DateTime.Today.AddDays(1).ToString("yyyy-MM-dd");
            newOrderDay.id = Guid.NewGuid().ToString();

            log.LogInformation($"Trying to add the following orderDay entity: {JsonConvert.SerializeObject(newOrderDay)}");

            // Final sanity check to make sure it's a Thursday
            if (newOrderDay.dateAsDate.DayOfWeek != DayOfWeek.Thursday)
            {
                log.LogError($"The new OrderDay for {tomorrow.ToString("yyyy-MM-dd")} isn't a Thursday");
                return;
            }

            if (await orderDayRepo.Add(newOrderDay))
            {
                log.LogInformation($"Successfully created new orderDay on {DateTime.Now}");
            }
            else
            {
                log.LogError("Failed to create orderDayEntity");
            }
        }
    }
}
