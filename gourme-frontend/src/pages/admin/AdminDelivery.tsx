import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

interface DeliveryPerson {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;
  totalDeliveries: number;
  rating: number;
  vehicleType: string;
}

const AdminDelivery: React.FC = () => {
  const [personnel, setPersonnel] = useState<DeliveryPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    profileId: '',
  });

  useEffect(() => {
    loadPersonnel();
  }, []);

  const loadPersonnel = async () => {
    try {
      const response = await adminApi.getAllDeliveryPersonnel();
      setPersonnel(response.data);
    } catch (error) {
      console.error('Error loading delivery personnel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createDeliveryPersonnel({
        ...formData,
        profileId: `delivery_${Date.now()}`,
      });
      setShowModal(false);
      setFormData({ name: '', phone: '', vehicleType: '', profileId: '' });
      loadPersonnel();
    } catch (error) {
      console.error('Error creating delivery person:', error);
      alert('Failed to create delivery personnel');
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await adminApi.toggleDeliveryActive(id, !isActive);
      loadPersonnel();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Delivery Personnel</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
          <PlusIcon className="h-5 w-5" />
          <span>Add Driver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personnel.map((person) => (
          <div key={person.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{person.name}</h3>
                  <p className="text-sm text-gray-500">{person.phone}</p>
                  {person.vehicleType && (
                    <p className="text-sm text-gray-500 mt-1">Vehicle: {person.vehicleType}</p>
                  )}
                </div>
                <button
                  onClick={() => handleToggleActive(person.id, person.isActive)}
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    person.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {person.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Deliveries</span>
                  <span className="font-medium">{person.totalDeliveries}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Rating</span>
                  <span className="font-medium text-yellow-600">{'★'.repeat(Math.round(person.rating))}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {personnel.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No delivery personnel found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add Delivery Driver</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                <input
                  type="text"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Motorcycle, Car, Scooter, etc."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">Add Driver</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDelivery;