# Salepe

Salepe is an event-driven order-management system built as a set of Spring Boot microservices communicating over Kafka, with two React front-ends (customer storefront and admin console).

## Architecture

| Component | Port | Stack | Purpose |
|---|---|---|---|
| `order-service` | 8081 | Spring Boot, JPA, Postgres (`order_db`) | Products and orders (`/api/products`, `/api/orders`); publishes to Kafka `order-topic` |
| `payment-service` | 8082 | Spring Boot, JPA, Postgres (`payment_db`) | Consumes order events; exposes `/api/payments/order/{orderId}` |
| `notification-service` | 8083 | Spring Boot, Kafka | Consumes order events and sends notifications |
| `analytics-service` | 8084 | Spring Boot, Kafka | Consumes order events; `/api/analytics/summary` |
| `shipping-service` | 8085 | Spring Boot, JPA, Postgres (`shipping_db`) | Consumes order events; exposes `/api/shipments/order/{orderId}` |
| `auth-service` | 8086 | Spring Boot | OTP login: `POST /api/auth/otp/request`, `POST /api/auth/otp/verify`, `GET /api/auth/session`, `POST /api/auth/logout` |
| `salepe-ui` | 5174 | React 19, Vite, TypeScript | Customer storefront (shop, cart, my orders) |
| `salepe-admin` | Vite default | React 19, Vite, TypeScript | Admin console (orders, products, analytics) |

Flow: `order-service` publishes an event to `order-topic`; payment, shipping, notification and analytics services each consume it in their own consumer group.

## Prerequisites

- Java 21 (Maven wrapper included)
- Node.js and npm
- Docker (for Kafka and Postgres)

## Getting started

1. Start infrastructure (Kafka KRaft on `9092`, Kafka UI on `8080`, Postgres on `5433`):

   ```sh
   docker compose up -d
   ```

   `init-db.sql` creates `order_db`, `payment_db` and `shipping_db` on first start.

2. Run each backend service (in separate terminals):

   ```sh
   cd order-service && ./mvnw spring-boot:run
   # repeat for payment-, shipping-, notification-, analytics- and auth-service
   ```

3. Run the front-ends:

   ```sh
   cd salepe-ui && npm install && npm run dev
   cd salepe-admin && npm install && npm run dev
   ```

## Configuration

Each service is configured in `src/main/resources/application.yaml`. Local defaults: Kafka at `localhost:9092`, Postgres at `localhost:5433` (user `postgres`). Auth OTPs are 6 digits, valid for 300s with max 5 attempts; sessions last 24h. Health endpoints are available at `/actuator/health`.

## Project layout

```
salepe/
├── docker-compose.yml   # Kafka, Kafka UI, Postgres
├── init-db.sql          # Per-service databases
├── *-service/           # Spring Boot microservices
├── salepe-ui/           # Customer web app
└── salepe-admin/        # Admin web app
```
