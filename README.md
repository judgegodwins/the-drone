# The Drone

To easily set up, add `DB_URI` and `CLOUDINARY_URL` to your .env.

If you use authentication on your MongoDB instance, set the following in your .env
```Bash
DB_NAME=<yourdbname>
DB_HOST=<dbhost>
DB_PORT=<dbport>
DB_USER=<dbuser>
DB_USER_PWD=<yourdbpassword>
NODE_ENV=development
CLOUDINARY_URL=<yourcloudinaryurl>
```

You'll need MongoDB and a Cloudinary URL to run.

The log job runs at the beginning of every one hour (e.g 1:00, 2:00) to log the battery status of every drone.

LightWeight drones can carry 200gr, MiddleWeight => 300gr, CruiserWeight => 400 gr, HeavyWeight => 500gr.

Run the following to build
```Bash
npm run build
```
Run the following to start server:
```Bash
npm run serve
```
On first serve, the DB will be seeded with 10 drones.

Endpoints:

POST `/drone/register`

Body
```JSON
{
  "model": "any of LightWeight, MiddleWeight, CruiserWeight, HeavyWeight",
  "state": "IDLE"
  "battery": "Number from 0 to 100"
}
```
Default state is IDLE

Response
```JSON
{
    "success": true,
    "message": "Drone created",
    "data": {
        "serialNumber": "d6c047cc-48a4-404d-a11a-a4df71e1ce70",
        "model": "LightWeight",
        "battery": 87,
        "state": "IDLE",
        "loads": [],
        "_id": "61f016e2aaac2deb29bb9957",
        "weightLimit": 200,
        "__v": 0
    }
}
```

PATCH `/drone/load`

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
`code` in the body is optional because it can be automatically generated

Example Response

```JSON
{
    "success": true,
    "message": "Medication added",
    "data": [
        {
            "_id": "61f10a0667d3e34933ceb790",
            "name": "js-load-u-r-t-t-d",
            "weight": 200,
            "code": "8EE4060E_184E_423C_9D12_CF346DA1F007",
            "image": "https://res.cloudinary.com/judge/image/upload/v1643186694/fedsrmen6wm3xatp7w7p.png",
            "__v": 0
        }
    ]
}
```

GET `/drone/get-loads?serialNumber=serialNumberOfDrone`

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

GET `/drone/available`

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
GET `/drone/battery-level?serialNumber=serialnumberofdrone`

```JSON
{
    "success": true,
    "message": "Battery level",
    "data": {
        "battery": 87
    }
}
```