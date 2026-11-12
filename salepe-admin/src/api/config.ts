// Base URLs for each backend microservice.
// These are local dev defaults (no secrets) — adjust if ports change.
export const API_BASE = {
  order: 'http://localhost:8081',
  payment: 'http://localhost:8082',
  notification: 'http://localhost:8083',
  analytics: 'http://localhost:8084',
  shipping: 'http://localhost:8085',
  auth: 'http://localhost:8086',
} as const;
