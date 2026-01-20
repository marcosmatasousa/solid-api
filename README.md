# About this repository

This repository stores a project developed for the sake of practice and study. The project implements an Wellhub-like application developed following SOLID, Clean architeture and TDD concepts.

## Tools

The application was developed using TypeScript, Fastify, Prisma, Zod and Vitest.

## Requirements

To run this project, you must have installed:

- Node 20+
- Docker

## Setup and run

With the requirements installed (and make sure Docker is running on your machine), in order to run this project, you need to run the setup command first:

```
npm run setup
```

Or, if you want to follow the steps manually, you can do it by running the following commands:

```
npm install
docker compose up -d
npx prisma migrate dev
```

Now, you need to setup the environment variables by running:

```
cp .env.example .env
```

Feel free to change any of the values in the `.env` file created.

Finally, to run the project in development mode run:

```
npm run dev
```

Notice that after running the app, it will automatically create an admin user. You can authenticate as an admin using the credentials:

```
email: admin@admin.com
password: admin
```

You can also create as much users as you like by POSTing on `/users`.

# How to use

In order to use the app, you can import the `Wellhub-like SOLID API` collection using Postman. The JSON file is located at the `postman` folder. And `Wellhub-like` environtment can be found in that folder as well, don't forget to fill the values of the variables in order to access authenticated routes.

Or, if you want, feel free to use curl to execute the requests.

# Routes

Base URL: `http://localhost:3000/`

## Users

### Register new user

```plaintext
POST /users
```

Supported attributes:

| Attribute  | Type   | Required | Description    |
| ---------- | ------ | -------- | -------------- |
| `name`     | string | Yes      | User name.     |
| `email`    | string | Yes      | User email.    |
| `password` | string | Yes      | User password. |

If successful, returns [`201 Created`](rest/troubleshooting.md#status-codes)

Example request:

```shell
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "johndoe@example.com",
    "password": "johndoe123"
  }'
```

### Authenticate user

```plaintext
POST /sessions
```

Supported attributes:

| Attribute  | Type   | Required | Description    |
| ---------- | ------ | -------- | -------------- |
| `email`    | string | Yes      | User email.    |
| `password` | string | Yes      | User password. |

If successful, returns [`200`](rest/troubleshooting.md#status-codes) and a JWT Token.

Example request:

```shell
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "johndoe@example.com",
    "password": "johndoe123"
  }'
```

Example response:

```json

  {
    "token": some_jwt_token_here
  }

```

### Get profile.

```plaintext
GET /me
```

Supported attributes:

| Attribute | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `token`   | string | Yes      | JWT Token   |

If successful, returns [`200`](rest/troubleshooting.md#status-codes)

Example request:

```shell
curl -X GET http://localhost:3000/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

Example response:

```json
{
  "user": {
    "id": "045c432f-984a-46cb-adf6-8f0f29e32ffb",
    "name": "admin",
    "email": "admin@admin.com",
    "role": "ADMIN",
    "created_at": "2026-01-19T16:44:57.239Z",
    "updated_at": "2026-01-19T16:44:57.239Z"
  }
}
```

## Gyms

### Create gym

### Register new user

```plaintext
POST /gyms/create
```

Supported attributes:

| Attribute     | Type   | Required | Description     |
| ------------- | ------ | -------- | --------------- |
| `title`       | string | Yes      | Gym title       |
| `description` | string | Yes      | Gym description |
| `phone`       | string | No       | Phone number    |
| `latitude`    | number | Yes      | Gym latitude    |
| `longitude`   | number | Yes      | Gym longitude   |
| `token`       | string | Yes      | JWT Token       |

This route requires ADMIN role.

If successful, returns [`201 Created`](rest/troubleshooting.md#status-codes)

Example request:

```shell
curl -X POST http://localhost:3000/gyms/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A new gym" ,
    "description": "A good gym",
    "phone": "281-330-8004",
    "latitude": 52.7621952,
    "longitude": -170.071863
  }'
```

### Search gyms.

```plaintext
GET /gyms/search
```

Supported attributes:

| Attribute | Type   | Required | Description                       |
| --------- | ------ | -------- | --------------------------------- |
| `query`   | string | Yes      | Title of the gym to be searched   |
| `page`    | number | No       | Number of the page to be searched |

If successful, returns [`200`](rest/troubleshooting.md#status-codes)

Example request:

```shell
curl -X GET "http://localhost:3000/gyms/search?query=A%20new%20gym&page=1"
```

Example response:

```json
{
  "gyms": [
    {
      "id": "780de359-30ce-4fe5-8b38-ffa3cbd0875f",
      "title": "An old gym",
      "description": "A good gym",
      "phone": "281-330-8004",
      "latitude": "52.7621952",
      "longitude": "-170.071863"
    },
    {
      "id": "ba66d9a0-e910-49a0-9887-f4c7e9e105d6",
      "title": "A new gym",
      "description": "A not bad gym",
      "phone": "291-320-8344",
      "latitude": "55.7621952",
      "longitude": "-150.071863"
    }
  ]
}
```

### Search nearby gyms.

```plaintext
GET /gyms/nearby
```

Supported attributes:

| Attribute   | Type   | Required | Description           |
| ----------- | ------ | -------- | --------------------- |
| `latitude`  | number | Yes      | Latitude of the user  |
| `longitude` | number | Yes      | Longitude of the user |

If successful, returns [`200`](rest/troubleshooting.md#status-codes)

Example request:

```shell
curl -X GET "http://localhost:3000/gyms/nearby?latitude=52.7621952&longitude=-170.071863"
```

Example response:

```json
{
  "gyms": [
    {
      "id": "780de359-30ce-4fe5-8b38-ffa3cbd0875f",
      "title": "An old gym",
      "description": "A good gym",
      "phone": "281-330-8004",
      "latitude": "52.7621952",
      "longitude": "-170.071863"
    },
    {
      "id": "ba66d9a0-e910-49a0-9887-f4c7e9e105d6",
      "title": "A new gym",
      "description": "A not bad gym",
      "phone": "291-320-8344",
      "latitude": "55.7621952",
      "longitude": "-150.071863"
    }
  ]
}
```

## Check-ins

### Create check-in

```plaintext
POST /check-ins/{gymId}
```

Supported attributes:

| Attribute   | Type   | Required | Description   |
| ----------- | ------ | -------- | ------------- |
| `gymId`     | string | Yes      | ID of the gym |
| `latitude`  | number | Yes      | User latitude |
| `longitude` | number | Yes      | User latitude |
| `token`     | string | Yes      | JWT Token     |

If successful, returns [`201 Created`](rest/troubleshooting.md#status-codes)

Example request:

```shell
curl -X POST http://localhost:3000/check-ins/{gymId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 52.7621952,
    "longitude": -170.071863
  }'
```

### Get check-in history

```plaintext
GET /check-ins/history
```

Supported attributes:

| Attribute | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `page`    | number | No       | Page number |
| `token`   | string | Yes      | JWT Token   |

If successful, returns [`200`](rest/troubleshooting.md#status-codes)

Example request:

```shell
curl -X GET http://localhost:3000/check-ins/history?page=1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

Example response:

```json
{
  "checkIns": [
    {
      "id": "65d02ec0-f88a-459b-a60a-0a6c2efc858e",
      "create_at": "2026-01-19T18:47:13.320Z",
      "validated_at": null,
      "user_id": "265e5bed-72ff-4696-8e5f-0e8e9237a6fb",
      "gym_id": "ba66d9a0-e910-49a0-9887-f4c7e9e105d6"
    }
  ]
}
```

### Get check-ins metrics

```plaintext
GET /check-ins/metrics
```

Supported attributes:

| Attribute | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `token`   | string | Yes      | JWT Token   |

If successful, returns [`200`](rest/troubleshooting.md#status-codes)

Example request:

```shell
curl -X GET http://localhost:3000/check-ins/history?page=1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

Example response:

```json
{
  "checkIns": 10
}
```

### Validate check-in

```plaintext
PATCH /check-ins/{checkInID}/validate
```

Supported attributes:

| Attribute | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `token`   | string | Yes      | JWT Token   |

This route requires ADMIN role.

If successful, returns [`204 No Content`](rest/troubleshooting.md#status-codes)

Example request:

```shell
curl -X PATCH http://localhost:3000/check-ins/{checkInID}/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## Tests

The application has also a set of tests that you can run by executing:
`npm run test`

Feel free to contact me. Thank you very much.

:)
