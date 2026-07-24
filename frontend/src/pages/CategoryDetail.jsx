import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Heart } from 'lucide-react';

export default function CategoryDetail() {
  const { categoryId } = useParams();
  const [ads, setAds] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  useEffect(() => {
    fetchCategoryAds(1);
  }, [categoryId]);

  const fetchCategoryAds = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/categories/${categoryId}/ads?page=${page}&limit=24`
      );
      if (!response.ok) throw new Error('Failed to fetch ads');
      
      const data = await response.json();
      setAds(data.ads);
      setPagination(data.pagination);
      
      // Set category name from first ad
      if (data.ads.length > 0) {
        setCategory(data.ads[0].category);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching category ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchCategoryAds(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const parseImages = (imagesString) => {
    try {
      const parsed = JSON.parse(imagesString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category?.name || 'Category'}
        </h1>
        <p className="text-gray-600">
          {pagination.total} {pagination.total === 1 ? 'item' : 'items'} available
        </p>
      </div>

      {/* Products Grid */}
      {ads.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {ads.map((ad) => {
              const images = parseImages(ad.images);
              const firstImage = images.length > 0 ? images[0] : null;

              return (
                <Link
                  key={ad.id}
                  to={`/ad/${ad.id}`}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {firstImage ? (
                      <img
                        src={`http://localhost:5001${firstImage}`}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">📦</span>
                      </div>
                    )}
                    {ad.isFeatured && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                    <button className="absolute top-2 left-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition">
                      {ad.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {ad.description}
                    </p>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {ad.location}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold text-indigo-600">
                        {ad.price.toLocaleString()} RWF
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 pt-2 border-t">
                      by {ad.user.name}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No items yet</h3>
          <p className="text-gray-500">Check back soon for new products in this category</p>
        </div>
      )}
    </div>
  );
}
