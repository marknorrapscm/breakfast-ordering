using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Configuration;
using Microsoft.Azure.Cosmos;
using System.Linq;
using tomas_breakfast.Repositories;
using tomas_breakfast.DTOs;
using tomas_breakfast.Models;

namespace tomas_breakfast.Api
{

    public static class Api
    {
        //////////////////////////////////////
        //////////////////////////////////////
        ////    Config
        //////////////////////////////////////
        //////////////////////////////////////
        [FunctionName("GetFormData")]
        public static async Task<IActionResult> GetFormData(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "Config/FormData")] HttpRequest req,
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
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "Config/FormData/Staff")] HttpRequest req,
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

            if (res)
            {
                return new OkResult();
            }
            else
            {
                return new BadRequestObjectResult("The request was fine but the order didn't get created :(");
            }
        }


        //////////////////////////////////////
        //////////////////////////////////////
        ////    Ordering
        //////////////////////////////////////
        //////////////////////////////////////
        [FunctionName("GetLatestOrder")]
        public static async Task<IActionResult> GetLatestOrder(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "Ordering/LatestOrder")] HttpRequest req,
            [CosmosDB(Connection = "CosmosDbConnectionString")] CosmosClient client,
            ILogger log)
        {
            var orderDayRepo = new OrderDayRepository(client);
            var orderRepo = new OrderRepository(client);
            var staffRepo = new StaffRepository(client);
            var menuItemsRepo = new MenuItemsRepository(client);

            var latestOrderDay = await orderDayRepo.GetLatest();
            var orders = await orderRepo.GetOrdersForDay(latestOrderDay.id);
            var staff = await staffRepo.GetAll();
            var menuItems = await menuItemsRepo.GetAll();

            var orderDto = new LatestOrderDTO();
            orderDto.orderDayId = latestOrderDay.id;
            orderDto.date = latestOrderDay.date;
            orderDto.cutoffTime = latestOrderDay.cutoffTime;
            orderDto.orders = orders.Select(x => new OrderDTO()
            {
                orderId = x.id,
                menuItem = x.menuItemId,
                staffId = x.staffId,
                staffName = staff.First(y => y.id == x.staffId).name
            }).ToList();

            return new OkObjectResult(orderDto);
        }

        [FunctionName("AddOrder")]
        public static async Task<IActionResult> AddToLatestOrder(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "Ordering/LatestOrder")] HttpRequest req,
            [CosmosDB(Connection = "CosmosDbConnectionString")] CosmosClient client,
            ILogger log)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var newOrderDto = JsonConvert.DeserializeObject<NewOrderDTO>(requestBody);

            var orderDayRepo = new OrderDayRepository(client);
            var latestOrderDay = await orderDayRepo.GetLatest();

            var cutoffDate = DateTime.Parse($"{latestOrderDay.date}T{latestOrderDay.cutoffTime}Z");

            if (DateTime.Now > cutoffDate)
            {
                return new BadRequestObjectResult($"You're ordering too late! Cuttof was {cutoffDate.ToString("yyyy-MM-dd @ HH:mm")}");
            }

            var newOrderEntity = new OrderEntity()
            {
                id = Guid.NewGuid().ToString(),
                menuItemId = newOrderDto.menuItem,
                orderDayId = latestOrderDay.id,
                staffId = newOrderDto.staffId
            };

            var orderRepo = new OrderRepository(client);
            var existingOrders = await orderRepo.GetOrderForStaffOnDay(newOrderDto.staffId, latestOrderDay.id);

            var res = false;

            if (existingOrders.Count == 0)
            {
                res = await orderRepo.Add(newOrderEntity);
            }
            else
            {
                var existingOrder = existingOrders.First();
                existingOrder.menuItemId = newOrderDto.menuItem;
                res = await orderRepo.Add(existingOrder);
            }

            if (res)
            {
                return new OkResult();
            }
            else
            {
                return new BadRequestObjectResult("The request was fine but the order didn't get created :(");
            }
        }

    }
}
