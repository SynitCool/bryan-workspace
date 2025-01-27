# Bryan Workspace

A workspace that i personally to accelarate my activities and work.

## Prerequisite 
1. node
2. npm
3. mongodb
4. create your mongodb database

## How to install

1. Fork this project
2. Add .env files to server folder and client folder

Content of .env of server folder
```
BRYAN_WORKSPACE_DATABASE = "mongodb://0.0.0.0:27017/<your-database>"
CLIENT_URL="<your-client-url>"
```
Content of .env of client folder
```
VITE_SERVER_URL = "<your-server-url>"
```
3. Run client
```
./dev-client.sh
```
4. Run server
```
./dev-server.sh
```

# For more info 
Check out the details in https://bryanalhilalsiregar.web.ugm.ac.id/bryan-workspace

Enjoy!
