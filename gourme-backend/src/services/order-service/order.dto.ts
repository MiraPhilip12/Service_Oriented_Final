export class CartItemDto {
  menuItemId: number;
  quantity: number;
  name: string;
  price: number;
}

export class CreateOrderDto {
  items: CartItemDto[];
  deliveryAddress: string;
  deliveryLat?: number;
  deliveryLng?: number;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card';
}

export class UpdateOrderStatusDto {
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
}