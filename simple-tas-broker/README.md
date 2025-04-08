# Simple TAS Service Broker

A simple service broker implementation for Tanzu Application Service (TAS) that implements the Open Service Broker API.

## Features

- Implements all required Open Service Broker API endpoints
- Basic authentication
- Simple service catalog with one service and one plan
- Health check endpoint
- Easy to deploy and test

## Prerequisites

- Node.js 16 or later
- Cloud Foundry CLI
- Access to a TAS environment

## Deployment

1. Install dependencies:
```bash
npm install
```

2. Deploy to TAS:
```bash
cf push
```

3. Register the service broker:
```bash
cf create-service-broker simple-broker admin secret https://simple-tas-broker.your-domain.com
```

4. Enable service access:
```bash
cf enable-service-access simple-service
```

## Testing

1. Create a service instance:
```bash
cf create-service simple-service shared my-service
```

2. Bind the service to an application:
```bash
cf bind-service my-app my-service
```

3. Verify the binding:
```bash
cf env my-app
```

4. Unbind the service:
```bash
cf unbind-service my-app my-service
```

5. Delete the service instance:
```bash
cf delete-service my-service -f
```

## Environment Variables

- `AUTH_USER`: Username for basic authentication (default: admin)
- `AUTH_PASSWORD`: Password for basic authentication (default: secret)
- `SERVICE_NAME`: Name of the service to expose (default: simple-service)
- `SERVICE_PLAN`: Name of the service plan (default: shared)
- `PORT`: Port to listen on (default: 3000)

## API Endpoints

- `GET /v2/catalog`: Service catalog
- `PUT /v2/service_instances/:instance_id`: Provision a service instance
- `DELETE /v2/service_instances/:instance_id`: Deprovision a service instance
- `PUT /v2/service_instances/:instance_id/service_bindings/:binding_id`: Create a service binding
- `DELETE /v2/service_instances/:instance_id/service_bindings/:binding_id`: Delete a service binding
- `GET /v2/service_instances/:instance_id/last_operation`: Get the last operation status
- `GET /health`: Health check endpoint 