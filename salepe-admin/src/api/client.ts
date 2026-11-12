import axios from 'axios';
import { API_BASE } from './config';
import type {
  Order,
  CreateOrderRequest,
  Payment,
  Shipment,
  AnalyticsSummary,
  OtpRequestResponse,
  OtpVerifyResponse,
  Product,
  CreateProductRequest,
} from '../types';

const orderClient = axios.create({ baseURL: API_BASE.order });
const paymentClient = axios.create({ baseURL: API_BASE.payment });
const shippingClient = axios.create({ baseURL: API_BASE.shipping });
const analyticsClient = axios.create({ baseURL: API_BASE.analytics });
const authClient = axios.create({ baseURL: API_BASE.auth });

export const OrdersApi = {
  list: (): Promise<Order[]> =>
    orderClient.get<Order[]>('/api/orders').then((r) => r.data),
  get: (id: string): Promise<Order> =>
    orderClient.get<Order>(`/api/orders/${id}`).then((r) => r.data),
  create: (payload: CreateOrderRequest): Promise<Order> =>
    orderClient.post<Order>('/api/orders', payload).then((r) => r.data),
};

export const ProductsApi = {
  list: (): Promise<Product[]> =>
    orderClient.get<Product[]>('/api/products').then((r) => r.data),
  get: (id: string): Promise<Product> =>
    orderClient.get<Product>(`/api/products/${id}`).then((r) => r.data),
  create: (payload: CreateProductRequest): Promise<Product> =>
    orderClient.post<Product>('/api/products', payload).then((r) => r.data),
};

export const PaymentsApi = {
  getByOrderId: (orderId: string): Promise<Payment> =>
    paymentClient.get<Payment>(`/api/payments/order/${orderId}`).then((r) => r.data),
};

export const ShipmentsApi = {
  getByOrderId: (orderId: string): Promise<Shipment> =>
    shippingClient.get<Shipment>(`/api/shipments/order/${orderId}`).then((r) => r.data),
};

export const AnalyticsApi = {
  summary: (): Promise<AnalyticsSummary> =>
    analyticsClient.get<AnalyticsSummary>('/api/analytics/summary').then((r) => r.data),
};

export const AuthApi = {
  requestOtp: (phoneNumber: string): Promise<OtpRequestResponse> =>
    authClient
      .post<OtpRequestResponse>('/api/auth/otp/request', { phoneNumber })
      .then((r) => r.data),
  verifyOtp: (phoneNumber: string, otp: string): Promise<OtpVerifyResponse> =>
    authClient
      .post<OtpVerifyResponse>('/api/auth/otp/verify', { phoneNumber, otp })
      .then((r) => r.data),
  logout: (token: string): Promise<void> =>
    authClient
      .post('/api/auth/logout', null, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => undefined),
};
