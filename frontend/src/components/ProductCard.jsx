import React from 'react';
import { ShoppingCart, Star, Megaphone } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const { name, price, originalPrice, image, category, rating, isSponsored, vendor } = product;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Product Image & Badges Container */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <img
            src={image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            {isSponsored && (
              <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                <Megaphone className="w-3 h-3" /> Sponsored Ad
              </span>
            )}
            {category && (
              <span className="bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                {category}
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {vendor && (
            <p className="text-xs text-gray-400 font-medium tracking-tight">By {vendor}</p>
          )}
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-500 text-xs">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-gray-700">{rating || '4.5'}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Cart Action Footer */}
      <div className="p-4 pt-0 flex items-center justify-between mt-auto">
        <div>
          <span className="text-lg font-black text-gray-900">${price}</span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through ml-2">${originalPrice}</span>
          )}
        </div>
        
        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white p-2.5 rounded-xl transition duration-200 flex items-center justify-center shadow-sm"
          title="Add to Cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}