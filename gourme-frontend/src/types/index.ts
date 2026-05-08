export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
  address?: string;
  phone?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerId: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryPersonId?: string;
  estimatedDeliveryTime?: string | null;
  actualDeliveryTime?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface DeliveryStatus {
  orderId: number;
  deliveryPersonId: number;
  deliveryPersonName: string;
  deliveryPersonPhone: string;
  estimatedArrivalMinutes: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
}