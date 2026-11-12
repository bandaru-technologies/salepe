import axios from 'axios';
import { API_BASE } from './config';
import type {
  Product,
  Order,
  CreateOrderRequest,
  OtpRequestResponse,
  OtpVerifyResponse,
} from '../types';

const orderClient = axios.create({ baseURL: API_BASE.order });
const authClient = axios.create({ baseURL: API_BASE.auth });

export const ProductsApi = {
  list: (): Promise<Product[]> =>
    orderClient.get<Product[]>('/api/products').then((r) => r.data),
  get: (id: string): Promise<Product> =>
    orderClient.get<Product>(`/api/products/${id}`).then((r) => r.data),
};

export const OrdersApi = {
  create: (payload: CreateOrderRequest): Promise<Order> =>
    orderClient.post<Order>('/api/orders', payload).then((r) => r.data),
  listByCustomer: (customerId: string): Promise<Order[]> =>
    orderClient
      .get<Order[]>('/api/orders', { params: { customerId } })
      .then((r) => r.data),
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
