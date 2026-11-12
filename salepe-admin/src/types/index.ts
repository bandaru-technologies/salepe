export type OrderStatus =
  | 'CREATED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface CreateOrderItemRequest {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  customerId: string;
  items: CreateOrderItemRequest[];
}

export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  status: PaymentStatus;
  processedAt: string;
}

export type ShipmentStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED';

export interface Shipment {
  id: string;
  orderId: string;
  customerId: string;
  status: ShipmentStatus;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
}

export interface OtpRequestResponse {
  phoneNumber: string;
  otp: string;
  expiresInSeconds: number;
}

export interface OtpVerifyResponse {
  token: string;
  phoneNumber: string;
  expiresInSeconds: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  stock: number;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
}
