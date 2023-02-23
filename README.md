# 🍔🥓 Breakfast Ordering 

Super basic app for ordering breakfast. Hosted in Azure with Azure Functions, CosmosDB and blob storage.

---

### Backend config:

#### `local.settings.json` template:

```
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet",
    "CosmosDbConnectionString": "Get this from CosmosDB"
  },
  "Host": {
    "CORS": "http://localhost:3000"
  }
}
```

### Frontend config:

#### Quick and nasty `.env` template:
```
REACT_APP_BaseUrl=
REACT_APP_BaseUrlDev=

REACT_APP_ForceUseOfProduction=
```
