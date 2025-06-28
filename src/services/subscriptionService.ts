import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'https://api.vidyavani.com/api';

// Types
export interface SubscriptionOrder {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  key_id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  isActive: boolean;
  plan: string;
  startDate: string | null;
  endDate: string | null;
  paymentHistory: Array<{
    razorpayPaymentId: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

// Create subscription order
export const createSubscriptionOrder = async (plan: 'monthly' | 'yearly' = 'yearly'): Promise<SubscriptionOrder> => {
  try {
    // Get the auth token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${API_URL}/users/subscription/create-order`, 
      { 
        plan,
        amount: 49900, // 499 INR in paise
        currency: 'INR'
      }, 
      { 
        headers: {
          ...authHeader(),
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data) {
      throw new Error('No data received from order creation');
    }

    return response.data;
  } catch (error: any) {
    console.error('Order creation error:', error.response?.data || error);
    throw error;
  }
};

// Verify payment after subscription payment
export const verifyPayment = async (paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => {
  const response = await axios.post(
    `${API_URL}/users/subscription/verify-payment`,
    paymentData,
    { headers: authHeader() }
  );
  
  // Update local storage with subscription data if payment verification was successful
  if (response.data.success && response.data.subscription) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.subscription = response.data.subscription;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  return response.data;
};

// Check subscription status
export const checkSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const response = await axios.get(
    `${API_URL}/users/subscription/status`,
    { headers: authHeader() }
  );
  return response.data;
};

// Cancel subscription
export const cancelSubscription = async () => {
  const response = await axios.post(
    `${API_URL}/users/subscription/cancel`,
    {},
    { headers: authHeader() }
  );
  
  // Update local storage if cancellation was successful
  if (response.data.success) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.subscription) {
        user.subscription.isActive = false;
      }
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  return response.data;
};
