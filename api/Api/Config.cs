using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Cosmos;
using System.Linq;
using tomas_breakfast.Repositories;
using tomas_breakfast.DTOs;
using tomas_breakfast.Models;

namespace tomas_breakfast.Api
{

    public static class Config
    {
        [FunctionName("GetFormData")]
        public static async Task<IActionResult> GetFormData(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Config/FormData")] HttpRequest req,
            [CosmosDB(Connection = "CosmosDbConnectionString")] CosmosClient client,
            ILogger log)
        {
            var staffRepo = new StaffRepository(client);
            var menuItemsRepo = new MenuItemsRepository(client);

            var staff = await staffRepo.GetAll();
            var menuItems = await menuItemsRepo.GetAll();

            var configDto = new ConfigDTO();
            configDto.staff = staff.Where(x => x.isActive).OrderBy(x => x.name).ToList();
            configDto.menuItems = menuItems.OrderBy(x => x.item).ToList();

            return new OkObjectResult(configDto);
        }

        [FunctionName("AddStaff")]
        public static async Task<IActionResult> AddStaff(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Config/Staff")] HttpRequest req,
            [CosmosDB(Connection = "CosmosDbConnectionString")] CosmosClient client,
            ILogger log)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic postData = JsonConvert.DeserializeObject(requestBody);

            var staffEntity = new StaffEntity()
            {
                id = Guid.NewGuid().ToString(),
                name = postData.staffName,
                isActive = true
            };

            var staffRepo = new StaffRepository(client);
            var res = await staffRepo.Add(staffEntity);

            return res
                ? new OkResult()
                : new BadRequestObjectResult("The request was fine but the order didn't get created :(");
        }
    }
}
