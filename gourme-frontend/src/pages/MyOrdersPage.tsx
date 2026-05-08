import React, { useEffect, useState } from 'react';
import { orderApi, deliveryApi, feedbackApi } from '../services/api';
import { Order, DeliveryStatus } from '../types';

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [showFeedback, setShowFeedback] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderApi.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDelivery = async (orderId: number) => {
    try {
      const response = await deliveryApi.getStatus(orderId);
      setDeliveryStatus(response.data);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error('Error loading delivery status:', error);
    }
  };

  const handleSubmitFeedback = async (orderId: number) => {
    try {
      await feedbackApi.create({
        orderId,
        rating: feedback.rating,
        comment: feedback.comment,
      });
      setShowFeedback(null);
      setFeedback({ rating: 5, comment: '' });
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Confirmed' },
      preparing: { color: 'bg-purple-100 text-purple-800', text: 'Preparing' },
      out_for_delivery: { color: 'bg-orange-100 text-orange-800', text: 'Out for Delivery' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gourme"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
        <button
          onClick={() => window.location.href = '/menu'}
          className="btn-primary"
        >
          Start Ordering
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gourme mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order: Order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.status)}
                  <p className="text-xl font-bold text-gourme mt-2">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-700">
                  <span className="font-medium">Delivery to:</span> {order.deliveryAddress}
                </p>
                
                {order.status === 'out_for_delivery' && selectedOrder === order.id && deliveryStatus && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Delivery Status</h4>
                    <p><strong>Driver:</strong> {deliveryStatus.deliveryPersonName}</p>
                    <p><strong>Phone:</strong> {deliveryStatus.deliveryPersonPhone}</p>
                    <p><strong>Estimated Arrival:</strong> {deliveryStatus.estimatedArrivalMinutes} minutes</p>
                  </div>
                )}

                {order.status === 'out_for_delivery' && selectedOrder !== order.id && (
                  <button
                    onClick={() => handleViewDelivery(order.id)}
                    className="mt-3 text-gourme hover:text-gourme-dark text-sm font-medium"
                  >
                    Track Delivery →
                  </button>
                )}

                {order.status === 'delivered' && showFeedback !== order.id && (
                  <button
                    onClick={() => setShowFeedback(order.id)}
                    className="mt-3 text-gourme hover:text-gourme-dark text-sm font-medium"
                  >
                    Write a Review →
                  </button>
                )}

                {showFeedback === order.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Rate your experience</h4>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFeedback({ ...feedback, rating: star })}
                          className={`text-2xl ${star <= feedback.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={feedback.comment}
                      onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                      placeholder="Share your experience with us..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubmitFeedback(order.id)}
                        className="btn-primary text-sm"
                      >
                        Submit Feedback
                      </button>
                      <button
                        onClick={() => setShowFeedback(null)}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;