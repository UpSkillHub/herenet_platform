import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, ShoppingBag, Clock, CheckCircle, XCircle, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      
      // Set default tab based on role
      if (parsedUser.isAdmin) {
        setActiveTab('overview');
      } else if (parsedUser.isMember) {
        setActiveTab('my-ads');
      } else {
        setActiveTab('orders');
      }
    }

    // Fetch user's ads if logged in
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/ads/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMyAds(data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard</p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const isAdmin = user?.isAdmin;
  const isMember = user?.isMember;

  // Calculate stats from myAds
  const pendingAds = myAds.filter(ad => ad.status === 'pending').length;
  const approvedAds = myAds.filter(ad => ad.status === 'approved').length;
  const rejectedAds = myAds.filter(ad => ad.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {isAdmin ? 'Administrator Dashboard' : isMember ? 'Seller Dashboard' : 'Buyer Dashboard'}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {isAdmin && (
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
          )}
          {(isMember || isAdmin) && (
            <button
              onClick={() => setActiveTab('my-ads')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'my-ads'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Ads ({myAds.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
              activeTab === 'wishlist'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Wishlist
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && isAdmin && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <Users className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-3xl font-bold mt-1">1,420</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <Package className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90">Total Ads</p>
              <p className="text-3xl font-bold mt-1">{myAds.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <DollarSign className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90">Revenue</p>
              <p className="text-3xl font-bold mt-1">$12,450</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'my-ads' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Approved</p>
                  <p className="text-2xl font-bold text-green-900">{approvedAds}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{pendingAds}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Rejected</p>
                  <p className="text-2xl font-bold text-red-900">{rejectedAds}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Ads List */}
          {myAds.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {myAds.map((ad) => (
                  <div key={ad.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900">{ad.title}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              ad.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : ad.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {ad.status}
                          </span>
                          {ad.isFeatured && (
                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{ad.category.name}</span>
                          <span>•</span>
                          <span>{ad.location}</span>
                          <span>•</span>
                          <span className="font-semibold text-indigo-600">
                            {ad.price.toLocaleString()} RWF
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/ad/${ad.id}`}
                        className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No ads yet</h3>
              <p className="text-gray-600 mb-6">Start posting your products to reach customers</p>
              <Link
                to={isAdmin ? "/admin/post-product" : "/post-ad"}
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Post Your First Ad
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Start shopping to see your order history here</p>
          <Link
            to="/categories"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Save items you love for later</p>
          <Link
            to="/categories"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}