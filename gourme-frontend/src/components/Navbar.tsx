import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  HomeIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="bg-gourme text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold italic">
            Gourme 🍽️
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-gourme-light transition">
              <HomeIcon className="h-5 w-5 inline mr-1" />
              Home
            </Link>
            
            {user && user.role === 'customer' && (
              <>
                <Link to="/menu" className="hover:text-gourme-light transition">
                  Menu
                </Link>
                <Link to="/cart" className="relative hover:text-gourme-light transition">
                  <ShoppingCartIcon className="h-5 w-5 inline" />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Link>
                <Link to="/my-orders" className="hover:text-gourme-light transition">
                  <ClipboardDocumentListIcon className="h-5 w-5 inline mr-1" />
                  My Orders
                </Link>
              </>
            )}

            {/* Admin Links */}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="hover:text-gourme-light transition font-semibold">
                <ChartBarIcon className="h-5 w-5 inline mr-1" />
                Admin Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  {user.fullName || user.email}
                </span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <Link to="/login" className="hover:text-gourme-light transition">Login</Link>
                <Link to="/register" className="bg-white text-gourme px-3 py-1 rounded-lg hover:bg-gray-100 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;