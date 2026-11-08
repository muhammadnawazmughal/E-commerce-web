export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const ORDER_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export const PAYMENT_METHODS = [
  { id: 'Card', name: 'Credit or Debit Card', description: 'Instant processing via secure token' },
  { id: 'PayPal', name: 'PayPal Express', description: 'Pay via your connected PayPal balance' },
  { id: 'COD', name: 'Cash on Delivery', description: 'Pay directly when package arrives' }
];

export const DEMO_CREDENTIALS = {
  ADMIN: {
    email: 'admin@cosmetics.com',
    password: 'Admin@123456',
    role: 'Administrator'
  },
  CUSTOMER: {
    email: 'customer@cosmetics.com',
    password: 'Customer@123456',
    role: 'Sophia Laurent (Customer)'
  }
};
