using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Cosmos;
using System.Linq;
using tomas_breakfast.Repositories;
using tomas_breakfast.DTOs;
using Newtonsoft.Json;
using tomas_breakfast.Models;
using System.Collections.Generic;

namespace tomas_breakfast.Api
{
    public static class Ordering
    {
        [FunctionName("GetLatestOrder")]
        public static async Task<IActionResult> GetLatestOrder(
             [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Ordering/LatestOrder")] HttpRequest req,
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

        [FunctionName("AddToLatestOrder")]
        public static async Task<IActionResult> AddToLatestOrder(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Ordering/LatestOrder")] HttpRequest req,
            [CosmosDB(Connection = "CosmosDbConnectionString")] CosmosClient client,
            ILogger log)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var newOrderDto = JsonConvert.DeserializeObject<NewOrderDTO>(requestBody);

            var orderDayRepo = new OrderDayRepository(client);
            var latestOrderDay = await orderDayRepo.GetLatest();

            //var cutoffDate = DateTime.Parse($"{latestOrderDay.date}T{latestOrderDay.cutoffTime}Z");

            //if (DateTime.Now > cutoffDate)
            //{
            //    return new BadRequestObjectResult($"You're ordering too late! Cuttof was {cutoffDate.ToString("yyyy-MM-dd @ HH:mm")}");
            //}

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

            return res
                ? new OkResult()
                : new BadRequestObjectResult("The request was fine but the order didn't get created :(");
        }

        [FunctionName("GenerateOrderList")]
        public static async Task<IActionResult> GenerateOrderList(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Ordering/LatestOrder/OrderList")] HttpRequest req,
            [CosmosDB(Connection = "CosmosDbConnectionString")] CosmosClient client,
            ILogger log)
        {
            var orderDayRepo = new OrderDayRepository(client);
            var latestOrderDay = await orderDayRepo.GetLatest();

            var orderRepo = new OrderRepository(client);
            var orders = await orderRepo.GetOrdersForDay(latestOrderDay.id);

            var menuItemFrequency = new Dictionary<string, int>();

            foreach (var order in orders)
            {
                if (menuItemFrequency.ContainsKey(order.menuItemId))
                {
                    menuItemFrequency[order.menuItemId]++;
                }
                else
                {
                    menuItemFrequency[order.menuItemId] = 1;
                }
            }

            return new OkObjectResult(menuItemFrequency);
        }
    }
}
