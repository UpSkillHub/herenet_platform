import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Store, ShieldCheck, HeartPulse, Search, Star, Filter, ArrowRight } from 'lucide-react';

export default function HealthMartPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Predefined categories for HealthMart
  const categories = ['All', 'Skincare & Beauty', 'Vitamins & Supplements', 'Personal Care', 'Fitness Nutrition', 'Natural Remedies'];

  // Mock Products specific to HealthMart
  const healthMartProducts = [
    {
      id: 'hm-1',
      name: 'Organic Vitamin C 1000mg Immunity Boost',
      price: '24.99',
      originalPrice: '29.99',
      category: 'Vitamins & Supplements',
      rating: 4.9,
      vendor: 'HealthMart',
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'hm-2',
      name: 'Advanced Retinol Anti-Aging Night Cream',
      price: '38.50',
      originalPrice: '45.00',
      category: 'Skincare & Beauty',
      rating: 4.8,
      vendor: 'HealthMart',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'hm-3',
      name: 'Pure Plant-Based Protein Powder (Vanilla)',
      price: '49.99',
      category: 'Fitness Nutrition',
      rating: 4.7,
      vendor: 'HealthMart',
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7c44369f?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'hm-4',
      name: 'Herbal Relaxation & Sleep Aid Tea',
      price: '16.99',
      originalPrice: '19.99',
      category: 'Natural Remedies',
      rating: 4.9,
      vendor: 'HealthMart',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'hm-5',
      name: 'Bamboo Charcoal Natural Oral Hygiene Kit',
      price: '21.00',
      category: 'Personal Care',
      rating: 4.6,
      vendor: 'HealthMart',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'hm-6',
      name: 'Omega-3 Deep Sea Fish Oil Capsules',
      price: '29.99',
      originalPrice: '34.99',
      category: 'Vitamins & Supplements',
      rating: 4.8,
      vendor: 'HealthMart',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600'
    }
  ];

  // Filter products based on search query and category selection
  const filteredProducts = healthMartProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Store Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-8 md:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-200" /> Verified Wellness Partner
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">HealthMart Store 🌿</h1>
          <p className="text-sm md:text-base opacity-90 leading-relaxed">
            Your premier destination for 100% certified organic wellness products, premium supplements, skincare essentials, and clean nutrition.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium pt-2">
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 Store Rating
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-xl">
              <HeartPulse className="w-4 h-4 text-emerald-200" /> Fast Shipping
            </span>
          </div>
        </div>

        {/* Quick Search inside banner */}
        <div className="w-full md:w-80 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-3 z-10">
          <label className="text-xs font-semibold uppercase tracking-wider opacity-90">Search HealthMart</label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-300 absolute left-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vitamins, skincare..." 
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-300 outline-none focus:bg-white/20 transition"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-gray-400 px-2 font-bold text-xs uppercase">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </div>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-xs ${
              selectedCategory === category
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCategory === 'All' ? 'All HealthMart Products' : selectedCategory}
          </h2>
          <span className="text-xs font-semibold text-gray-500">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={(prod) => console.log('Added to cart from HealthMart:', prod)} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
            <p className="text-gray-500 text-sm font-medium">No wellness products found matching your search.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}