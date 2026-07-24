import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, User, LogIn, Search, Bell } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout() {
  const [userRole, setUserRole] = useState('buyer');
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Handle sidebar navigation changes and route switching
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    if (tabId === 'dashboard') {
      navigate('/dashboard');
    } else if (tabId === 'analytics') {
      navigate('/analytics');
    } else if (['explore', 'fashion-hive', 'health-mart', 'technest'].includes(tabId)) {
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Permanent Left Sidebar */}
      <Sidebar userRole={userRole} activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area with Top Navbar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="font-semibold text-gray-800">Shopacla Platform</span>
            <span>/</span>
            <span className="capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative rounded-xl hover:bg-gray-50 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link to="/cart" className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3.5 py-2 rounded-xl text-xs font-bold transition"
            >
              <User className="w-4 h-4" /> Account
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Shopacla E-Commerce & Advertising Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
}