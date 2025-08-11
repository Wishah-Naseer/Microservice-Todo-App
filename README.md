# Microservice Todo Application

This repository contains a simple microservice-based TODO application built with Node.js, Express and TypeORM. The system is split into two services:

- **User Service** – handles user registration, login and retrieval.
- **Todo Service** – manages TODO items for authenticated users.

Each service persists data in its own PostgreSQL database and communicates over HTTP. Authentication is implemented with JSON Web Tokens (JWT).

## Project Structure

```
Microservice-Todo-Application/
├── docker-compose.yml       # Orchestrates services and PostgreSQL databases
├── user-service/            # User microservice (runs on port 4000)
├── todo-service/            # Todo microservice (runs on port 4001)
└── frontend/               # Static HTML/CSS/JS frontend
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) and Docker Compose

## Running with Docker

1. Ensure Docker is running.
2. Build and start the stack:

   ```bash
   docker compose up -d --build
   ```

   The services are available at `http://localhost:4000` (User Service) and `http://localhost:4001` (Todo Service). The frontend can be accessed at `http://localhost:8081/login.html`.

## Running Locally

To run the services without Docker, install the dependencies and start each
service individually:

1. Navigate to a service directory (`user-service` or `todo-service`).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in each service directory with the following values as a starting point.

**user-service/.env**
```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=password
DB_NAME=users
JWT_SECRET=supersecret
```

**todo-service/.env**
```
PORT=4001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=todo
DB_PASSWORD=password
DB_NAME=todos
JWT_SECRET=supersecret
# URL used by the todo service to talk to the user service
USER_SERVICE_URL=http://localhost:4000
```

## API Overview

### User Service
- `POST /user/register` – create a new user.
- `POST /user/login` – authenticate and receive a JWT.
- `GET /user/:id` – fetch a user by id.

### Todo Service
All Todo endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

- `POST /api/todo` – create a new todo item.
- `GET /api/todo` – list todos for the authenticated user.
- `PUT /api/todo/:id` – update an existing todo.
- `DELETE /api/todo/:id` – remove a todo.

## Frontend

A minimal static frontend is available in `frontend/`. When running with Docker Compose it is served on port `8081`. Open `http://localhost:8081/login.html` in your browser to register, log in and manage todos.

## Postman Collection

A Postman collection demonstrating the APIs is available [here](https://www.postman.com/wishahnaseer/wishah-public-workspace/collection/lnuqefs/aici-challenge?action=share&creator=23242898).

## OpenAPI Documentation

OpenAPI specifications for the services are provided in the repository:

- `user-service/openapi.yaml`
- `todo-service/openapi.yaml`

These files can be imported into tools like Postman or Bruno for interactive exploration.

## API Documentation

API detailed documentation pdf file is also provided in this repository.

## Unit Tests

Test Suite is also provided in the repository:

`unit-tests/api.test.js`

To run the tests:

1. Install dependencies

      ```bash
      npm install jest axios
      ```
2. Run

   ```bash
   npm test
   ```
   or

   ```bash
   npx jest api.test.js
   ```