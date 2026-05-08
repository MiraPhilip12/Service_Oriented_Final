import React, { useEffect, useState } from 'react';
import { menuApi } from '../services/api';
import { MenuItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const response = await menuApi.getAvailable();
      setMenuItems(response.data);
      const uniqueCategories = ['All', ...new Set(response.data.map((item: MenuItem) => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gourme"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gourme mb-8">Our Menu</h1>
      
      <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-gourme text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item: MenuItem) => (
          <div key={item.id} className="card">
            <div className="h-48 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">🍽️ {item.name}</span>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gourme">{item.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold text-gourme">${item.price}</span>
                <button
                  onClick={() => addToCart(item, 1)}
                  className="btn-primary flex items-center space-x-1"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;