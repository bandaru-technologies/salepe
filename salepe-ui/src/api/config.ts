// Base URLs for the backend microservices this app talks to.
// order-service hosts both the product catalog and order APIs.
export const API_BASE = {
  order: 'http://localhost:8081',
  auth: 'http://localhost:8086',
} as const;
