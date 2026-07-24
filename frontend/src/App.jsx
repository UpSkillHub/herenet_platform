import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import HealthMartPage from './pages/HealthMart';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';

// Marketplace Feed View
const HomeFeed = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-800">Shopacla Marketplace Feed 🛍️</h1>
    <p className="text-gray-600 mt-2">Discover products and sponsored deals below.</p>
  </div>
);

const AdDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-800">Vendor Advertising Dashboard 📢</h1>
    <p className="text-gray-600 mt-2">Manage your campaigns, track impressions, and boost your sales.</p>
  </div>
);

const CartPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart 🛒</h1>
    <p className="text-gray-600 mt-2">Review your selected items before checkout.</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<HomeFeed />} />
          <Route path="/ads-dashboard" element={<AdDashboard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/health-mart" element={<HealthMartPage />} />
          
          {/* Category Routes */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:categoryId" element={<CategoryDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}