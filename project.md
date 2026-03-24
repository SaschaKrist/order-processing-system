# 🚀 Order Processing System

A scalable microservice-based system for processing CSV imports using asynchronous, event-driven architecture.

---

# 🧭 Architecture Overview

The system follows an **event-driven, asynchronous processing model**.

## Core Principles

* Upload is **fast and non-blocking**
* Processing happens **in the background**
* System is **horizontally scalable via workers**
* Services are **loosely coupled**

---

# 🔄 End-to-End Flow

## 1. Upload

Frontend → API Gateway → Order Service

* CSV file is uploaded
* Request returns immediately
* Processing starts asynchronously

---

## 2. Import Creation (Order Service)

* Creates an `Import` record in MongoDB
* Status: `processing`
* Parses CSV
* Publishes each row as an event:

```
order.imported
```

---

## 3. Async Processing (Processing Service)

Workers consume messages:

* Create order
* Validate data
* Execute business logic

Emit result events:

```
order.completed
order.failed
```

---

## 4. Status Aggregation (Notification Service)

* Tracks:

  * processed
  * success
  * failed
* Updates Import record
* Detects completion:

```
if processed === totalRows → status = finished
```

---

## 5. Status Display (Frontend)

Polling endpoint:

```
GET /imports/:id
```

Displays:

* Progress (%)
* Success / failure counts
* Final status

---

# 🧩 Data Model

## Import

```json
{
  "importId": "string",
  "totalRows": 100,
  "processed": 42,
  "success": 40,
  "failed": 2,
  "status": "processing | finished"
}
```

## Order

```json
{
 
   "orderId": "string",
  "importId": "string",

  "status": "pending | completed | failed",

  "customer": {
    "name": "string",
    "email": "string"
  },

  "lineItems": [
    {
      "name": "string",
      "quantity": 2,
      "price": 19.99
    }
  ],

  "totalAmount": 39.98,

  "currency": "EUR",

  "createdAt": "ISODate",
  "processedAt": "ISODate | null",

  "error": "string | null"
}
```

---

# ⚙️ System Components

## API Gateway

**Responsibilities:**

* Entry point
* Routing
* Authentication (JWT)
* Optional: rate limiting, logging

---

## Order Service

**Responsibilities:**

* Create import
* Parse CSV
* Publish events

---

## Processing Service

**Responsibilities:**

* Consume queue messages
* Create orders
* Get Orders
* Get Order
* Execute business logic

**Scaling:**

* Multiple instances supported

---

## Notification Service

**Responsibilities:**

* Aggregate events
* Track progress
* Finalize imports

---

# 🐰 Messaging (RabbitMQ)

## Events

* `order.imported`
* `order.completed`
* `order.failed`

## Benefits

* Loose coupling
* Horizontal scalability
* Resilient processing

---

# 🐳 Deployment (Docker)

## Minimal Setup

```yaml
version: "3.8"

services:
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  mongo:
    image: mongo
    ports:
      - "27017:27017"

  order-service:
    build: ./order-service
    depends_on:
      - rabbitmq
      - mongo

  processing-service:
    build: ./processing-service
    depends_on:
      - rabbitmq
      - mongo

  notification-service:
    build: ./notification-service
    depends_on:
      - rabbitmq
      - mongo

  api-gateway:
    build: ./gateway
    ports:
      - "3000:3000"
```

---

## 🔁 Scaling Workers

```bash
docker compose up --scale processing-service=3
```

➡️ More workers = higher throughput

---

# 🗄️ Database Strategy

## For this Project

* Single MongoDB instance
* Separate collections:

  * `imports`
  * `orders`

---

## In Production

* Each service has its own database

**Reasons:**

* Loose coupling
* Independent scaling
* Clear ownership

---

# 🔒 Security

## Auth Flow

1. Client sends JWT
2. API Gateway validates token
3. Request is forwarded to services

---

## Simplified Demo Setup

* Auth handled only in Gateway
* Internal services trust Gateway

---

# 📁 Service Structure (Node.js)

```
/service-name
 ├─ src
 │   ├─ index.js
 │   ├─ routes.js
 │   ├─ controllers/
 │   ├─ services/
 │   └─ models/
 ├─ package.json
 └─ Dockerfile
```

---

# ⚡ Scaling Behavior

* Workers process messages in parallel
* RabbitMQ distributes load automatically
* No code changes required for scaling

---

# 🧠 Design Decisions

## Why async processing?

* Avoids long-running HTTP requests
* Handles large CSV files efficiently
* Improves system stability under load

---

## Why a queue?

* Enables backpressure handling
* Supports retries
* Decouples services

---

## Why a Notification Service?

* Separates concerns
* Keeps processing logic clean
* Easily extendable (e.g. email, webhooks)

---

# 🚀 Future Improvements

## Reliability

* Retry mechanism
* Dead Letter Queue (DLQ)
* Idempotency handling

---

## UX

* WebSockets instead of polling
* Real-time progress updates

---

## Observability

* Logging (e.g. Winston)
* Metrics (Prometheus)
* Tracing (OpenTelemetry)

---

## Security

* Service-to-service authentication
* mTLS
* Role-based access control

---

# 🎯 Summary

This architecture provides:

* Clear service separation
* High scalability
* Resilient processing
* Real-world microservice design

➡️ Ideal for portfolio projects and technical interviews
