import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  StarIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { adminApi } from '../../services/api';  // ✅ ADD THIS LINE
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';
import AdminDelivery from './AdminDelivery';
import AdminFeedback from './AdminFeedback';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'menu', name: 'Menu Management', icon: ShoppingBagIcon },
    { id: 'orders', name: 'Orders', icon: ClipboardDocumentListIcon },
    { id: 'delivery', name: 'Delivery Personnel', icon: TruckIcon },
    { id: 'feedback', name: 'Feedback', icon: StarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-gourme text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gourme-light mt-1">Manage your restaurant</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition ${
                  activeTab === tab.id
                    ? 'text-gourme border-b-2 border-gourme'
                    : 'text-gray-600 hover:text-gourme'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'menu' && <AdminMenu />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'delivery' && <AdminDelivery />}
        {activeTab === 'feedback' && <AdminFeedback />}
      </div>
    </div>
  );
};

// Overview Component
const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    averageRating: 0,
    activeDelivery: 0,
    totalDelivery: 0,
  });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [salesRes, ordersRes, ratingRes, deliveryStatsRes] = await Promise.all([
        adminApi.getSalesTotal(),
        adminApi.getOrderCount(),
        adminApi.getAverageRating(),
        adminApi.getDeliveryStats(),
      ]);

      setStats({
        totalSales: salesRes.data.totalSales || 0,
        orderCount: ordersRes.data.orderCount || 0,
        averageRating: ratingRes.data.averageRating || 0,
        activeDelivery: deliveryStatsRes.data.activePersonnel || 0,
        totalDelivery: deliveryStatsRes.data.totalPersonnel || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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

  const statCards = [
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.orderCount,
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Avg Rating',
      value: stats.averageRating.toFixed(1),
      icon: StarIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'Delivery Staff',
      value: `${stats.activeDelivery}/${stats.totalDelivery}`,
      icon: TruckIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <p className="text-gray-500 text-center py-8">Recent orders will appear here</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary">Add New Menu Item</button>
            <button className="w-full btn-secondary">Add Delivery Personnel</button>
            <button className="w-full btn-secondary">View All Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;