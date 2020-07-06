# Online Payments

## Getting started 

### Configuration

Configuration files for modules are located in [payment-gate/config](./payment-gate/config), [check-status/config](./check-status/config) folders.
DB connection and Check Status service URL configuration must be adjusted appropriately for the environment.
Before running the containers the database variables should be set up in the appropriate environment files [db-variables](./db-variables.env) and [db-variables.testing](./db-variables.testing.env)

The system is customizable and allows you to accept payments separately for active customers, for inactive, for both cases together.
The settings are stored in the database in the `settings` table: the setting name is `customersWhoCanMakePayments` and possible values are `All`, `Active`, `Inactive`. 
 
### Running

Run containers using the following command: 
```
docker-compose up --build
```

Now there should be two servers running:
  - [http://localhost:8080](http://localhost:8080) is the Check Customer Status service
  - [http://localhost:8081](http://localhost:8081) is the Payment Gate service

To stop containers, use the following command:
```
docker-compose stop
```
  
## Swagger contracts description

The contracts description is automatically generated using swagger-jsdoc and swagger-combine packages.
After the services are launched, the description can be found at the following URLs:
 - [http://localhost:8080/api/api-docs/](http://localhost:8080/api/api-docs/) for the Check Customer Status service
 - [http://localhost:8081/api/api-docs/](http://localhost:8081/api/api-docs/) for the Payment Gate service

## Architecture description

### Solution

The solution consists of two modules and a database schema.
The first module is used to receive payment requests and is called the Payment Gate.
The second one is used to check customer status and is called the Check Customer Status.
To create modules, the Express framework is used, which allows us to create a robust API as quickly and easily.
To validate data within the Express app according to a Swagger/OpenAPI definition, the openapi-validator-middleware package is used.
The app uses PostgreSQL database to store data. To work with database, we use the knex package - this is a multi-dialect query builder which is also flexible and portable.

The diagram below provides a general overview of the architecture of the proposed solution.  

![Diagram](readme-resources/architecture.svg?raw=true "Architecture")
 
### Workflow

The Payment Gate module receives a payment request, and then sends a customer verification request to the Check Status module.
The Check Status module requests the status of the customer in the database and returns its status.
The Payment Gate module sends a request to the database to replenish the customer’s personal account.
The Payment Gate module sends a response to the calling system.

The following diagram gives a general overview of the workflow:

![Diagram](readme-resources/workflow.svg?raw=true "Workflow")

## Test coverage

Some tests rely on databases, 
so you need to setup DB variables for testing environment [db-variables](./db-variables.testing.env) and run database container with the following command:

```
docker-compose -f docker-compose.testing.yml up --build
```

To stop database containers, use the following command:
```
docker-compose down
```

Before running the tests you need to setup DB connection for each module [check-status](./check-status/config/testing.js), [payment-gate](./payment-gate/config/testing.js) and then run the tests with the following command:
```
npm test
```
At the very end, a code coverage report will be displayed that is generated using the nyc package.

Coverage summary for the Check Status module:

![Check status](readme-resources/check-status.png?raw=true "Check Status")

Coverage summary for the Payment Gate module:

![Payment Gate](readme-resources/payment-gate.png?raw=true "Payment Gate")

