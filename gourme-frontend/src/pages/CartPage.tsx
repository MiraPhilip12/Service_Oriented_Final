import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../services/api';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { CartItem as CartItemType } from '../types';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState({
    deliveryAddress: user?.address || '',
    paymentMethod: 'cash' as 'cash' | 'credit_card' | 'debit_card',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkoutData.deliveryAddress) {
      setError('Please enter your delivery address');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.map((item: CartItemType) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
        deliveryAddress: checkoutData.deliveryAddress,
        paymentMethod: checkoutData.paymentMethod,
      };

      await orderApi.create(orderData);
      clearCart();
      navigate('/my-orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <button
          onClick={() => navigate('/menu')}
          className="btn-primary"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gourme mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cart.map((item: CartItemType) => (
                <div key={item.menuItemId} className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gourme font-bold">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MinusIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <PlusIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">$5.00</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-gourme">${(getTotal() + 5).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  value={checkoutData.deliveryAddress}
                  onChange={(e) => setCheckoutData({ ...checkoutData, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-gourme focus:border-gourme"
                  rows={2}
                  placeholder="Enter your full delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={checkoutData.paymentMethod}
                  onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-gourme focus:border-gourme"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Place Order • $${(getTotal() + 5).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;