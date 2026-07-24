import React from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, ArrowUpRight, DollarSign, Globe } from 'lucide-react';

export default function Analytics() {
  // Mock performance data by country/region
  const salesByCountry = [
    { country: 'Germany', flag: '🇩🇪', products: '4.4k products', revenue: '$48,200' },
    { country: 'France', flag: '🇫🇷', products: '3.6k products', revenue: '$39,100' },
    { country: 'Italy', flag: '🇮🇹', products: '3.1k products', revenue: '$31,500' },
    { country: 'Austria', flag: '🇦🇹', products: '2.9k products', revenue: '$24,800' },
    { country: 'Switzerland', flag: '🇨🇭', products: '2.7k products', revenue: '$22,600' },
    { country: 'Spain', flag: '🇪🇸', products: '1.2k products', revenue: '$11,400' },
  ];

  // Top products sales
  const topProducts = [
    { id: 1, name: 'Vitamin Boost', sku: 'SP00910SK', price: '$8/item', sold: '2.3k sold', change: '+14%' },
    { id: 2, name: 'Organic Protein Bar', sku: 'SP00422SK', price: '$3/item', sold: '1.2k sold', change: '+8%' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1 font-medium">
            <span>Home</span> &gt; <span>Store</span> &gt; <span className="text-gray-700 font-semibold">Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Store Analytics & Performance 📈</h1>
        </div>
        <div className="bg-white border border-gray-100 shadow-xs px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Data Sync Active
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orders Provided</span>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-black text-gray-900">210</p>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">109 Processed</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-lg flex items-center gap-0.5">
              +12.4% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Store Revenue</span>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-black text-gray-900">$34,250</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">352 items sold out</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded-lg flex items-center gap-0.5">
              +18.2% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orders Imported</span>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-black text-gray-900">176</p>
              <p className="text-xs text-purple-600 font-semibold mt-0.5">New incoming batches</p>
            </div>
            <span className="text-xs bg-purple-50 text-purple-700 font-bold px-2 py-1 rounded-lg flex items-center gap-0.5">
              +5.1% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Sales By Country & Performance Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales By Country */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Sales by Country</h2>
            <button className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">View All</button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {salesByCountry.map((item, index) => (
              <div key={index} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.flag}</span>
                  <span className="font-bold text-gray-900 text-sm">{item.country}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{item.products}</span>
                  <span className="font-bold text-indigo-600">{item.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Performance</h2>
            <span className="text-xs text-gray-400 font-medium">Jan - Mar</span>
          </div>

          {/* Simulated Bar Graph Graphic */}
          <div className="h-44 flex items-end justify-center gap-6 pt-6 pb-2 px-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-10 bg-indigo-500 rounded-t-lg h-3/4 shadow-sm"></div>
              <span className="text-[10px] font-bold text-gray-500">Jan</span>
            </div>
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-10 bg-indigo-300 rounded-t-lg h-2/5 shadow-sm"></div>
              <span className="text-[10px] font-bold text-gray-500">Feb</span>
            </div>
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-10 bg-indigo-600 rounded-t-lg h-5/6 shadow-sm"></div>
              <span className="text-[10px] font-bold text-gray-500">Mar</span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 px-1">
            <span>Total Traffic: <strong className="text-gray-900">12.4k</strong></span>
            <span>Total Rev: <strong className="text-indigo-600">$34.2k</strong></span>
          </div>
        </div>
      </div>

      {/* Top Product Sales Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Top Product Sales</h2>
          <button className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">View All</button>
        </div>

        <div className="space-y-3">
          {topProducts.map((prod) => (
            <div key={prod.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
                  💊
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{prod.name}</h3>
                  <p className="text-xs text-gray-400">SKU: {prod.sku}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">{prod.sold}</p>
                  <p className="text-xs text-gray-400">{prod.price}</p>
                </div>
                <span className="bg-indigo-600 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm">
                  {prod.change} <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}