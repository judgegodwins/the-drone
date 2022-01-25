# The Drone

To easily set up, add `DB_URI` and `CLOUDINARY_URL` to your .env

You'll need a Cloudinary URL to run.

Run the following to build
```Bash
npm run build
```
Run the following to start server:
```Bash
npm run serve
```
On first serve, the DB will be seeded with 10 drones.

To be completed:
validator bug, schedule job

Endpoints:

POST /drone/register
Body
```JSON
{
  "model": "any of LightWeight, MiddleWeight, CruiserWeight, HeavyWeight",
  "battery": "Number from 0 to 100"
}
```
PATCH /drone/load

Query
?serialNumber=serialnumberofdrone

Body: Should be form-data format
```JSON
{
  "name": "string",
  "weight": "number",
  "code": "string with Uppercase letters, numbers and underscore",
  "image": "your image form data file"
}
```
code in the body is optional because it'll automatically be generated

GET /drone/get-loads?serialNumber=serialNumberOfDrone

Response
Returns the loads in a drone
```JSON
{
    "success": true,
    "message": "Load on drone",
    "data": [
        {
            "_id": "61f0051a96d31f0fc79d57ed",
            "name": "jason-load",
            "weight": 192,
            "code": "HELLO_T_CAT",
            "__v": 0
        },
        {
            "_id": "61f0058ad672062f227b2b4e",
            "name": "jason-load",
            "weight": 192,
            "code": "HELLO_T_CAT_R",
            "__v": 0
        }
    ]
}
```

GET /drone/available

Response
Returns list of available drones
```JSON
{
    "success": true,
    "message": "Available drones",
    "data": [
        {
            "_id": "61eff0eea6db520f90746592",
            "serialNumber": "b8f1f5f0-6647-4b8e-a4ed-788f780d7279",
            "model": "LightWeight",
            "battery": 87,
            "state": "IDLE",
            "loads": [
                "61f0051a96d31f0fc79d57ed",
                "61f0058ad672062f227b2b4e"
            ],
            "weightLimit": 200,
            "__v": 0
        }
    ]
}
```
GET /drone/battery-level?serialNumber=serialnumberofdrone

```JSON
{
    "success": true,
    "message": "Battery level",
    "data": {
        "battery": 87
    }
}
```