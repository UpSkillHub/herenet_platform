import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Megaphone, ShieldCheck, TrendingUp, ArrowRight, Store } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="bg-indigo-700/60 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/30">
            E-Commerce + Advertising Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Buy, Sell, and <span className="text-indigo-300">Advertise</span> All in One Place.
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto font-light">
            Shopacla connects buyers with unique products while giving vendors and merchants powerful ad tools to supercharge their sales.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-8 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-lg"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="bg-indigo-700/50 hover:bg-indigo-700 text-white border border-indigo-400/30 font-semibold px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Shopacla?</h2>
            <p className="text-gray-600 mt-2">Designed for modern shoppers and ambitious business vendors.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Vibrant Marketplace</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Discover top-tier items across multiple categories with a seamless shopping cart and checkout experience.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Built-In Ad Platform</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Vendors can create custom ad campaigns, launch sponsored product slots, and expand their audience reach instantly.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Real-Time Analytics</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Track impressions, click-through rates (CTR), and budget performance straight from your dedicated vendor dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-gray-100 py-16 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Ready to grow your business or start shopping?</h2>
          <p className="text-gray-600">Join Shopacla today and experience a smarter e-commerce ecosystem.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}