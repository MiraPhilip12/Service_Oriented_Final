import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';

interface Feedback {
  id: number;
  orderId: number;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const AdminFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ averageRating: 0, total: 0 });

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const [feedbackRes, ratingRes] = await Promise.all([
        adminApi.getAllFeedback(),
        adminApi.getAverageRating(),
      ]);
      setFeedback(feedbackRes.data);
      setStats({
        averageRating: ratingRes.data.averageRating || 0,
        total: feedbackRes.data.length,
      });
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gourme"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Average Rating</p>
            <p className="text-4xl font-bold text-gourme">{stats.averageRating.toFixed(1)}</p>
            <div className="text-yellow-500 text-xl mt-1">
              {'★'.repeat(Math.round(stats.averageRating))}
              {'☆'.repeat(5 - Math.round(stats.averageRating))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Total Reviews</p>
            <p className="text-4xl font-bold text-gourme">{stats.total}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-6">Customer Feedback</h2>

      <div className="space-y-4">
        {feedback.map((fb) => (
          <div key={fb.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500">Order #{fb.orderId}</p>
                <p className="text-sm text-gray-500">Customer: {fb.customerId}</p>
                <p className="text-sm text-gray-500">{new Date(fb.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg font-semibold text-yellow-500">{fb.rating}</span>
                <span className="text-yellow-500">★</span>
              </div>
            </div>
            {fb.comment && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700 italic">"{fb.comment}"</p>
              </div>
            )}
          </div>
        ))}

        {feedback.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No feedback submitted yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;