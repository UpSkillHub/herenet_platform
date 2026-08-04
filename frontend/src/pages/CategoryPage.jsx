import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  Star,
  ChevronDown,
  Grid3X3,
  List,
  Package,
  X,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import { useAuth } from "../contexts/AuthContext";

// =====================================================
// DUMMY PRODUCTS
// =====================================================

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Electronics",
    subcategory: "Phones",
    price: 1250000,
    originalPrice: 1400000,
    rating: 4.8,
    reviews: 124,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600",
    featured: true,
    vendor: "TechNest",
  },

  {
    id: 2,
    name: "Samsung Galaxy S25",
    category: "Electronics",
    subcategory: "Phones",
    price: 980000,
    originalPrice: 1100000,
    rating: 4.7,
    reviews: 98,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
    featured: true,
    vendor: "TechNest",
  },

  {
    id: 3,
    name: "Google Pixel 9",
    category: "Electronics",
    subcategory: "Phones",
    price: 850000,
    originalPrice: 920000,
    rating: 4.6,
    reviews: 76,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
    featured: false,
    vendor: "TechNest",
  },

  {
    id: 4,
    name: "Wireless Headphones",
    category: "Electronics",
    subcategory: "Audio",
    price: 145000,
    originalPrice: 180000,
    rating: 4.5,
    reviews: 63,
    stock: 24,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    featured: true,
    vendor: "TechNest",
  },

  {
    id: 5,
    name: "MacBook Air M3",
    category: "Electronics",
    subcategory: "Laptops",
    price: 1850000,
    originalPrice: 2000000,
    rating: 4.9,
    reviews: 87,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=600",
    featured: true,
    vendor: "TechNest",
  },

  {
    id: 6,
    name: "Dell XPS 15",
    category: "Electronics",
    subcategory: "Laptops",
    price: 1650000,
    originalPrice: 1750000,
    rating: 4.7,
    reviews: 54,
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    featured: false,
    vendor: "TechNest",
  },

  {
    id: 7,
    name: "Nike Air Max",
    category: "Fashion",
    subcategory: "Shoes",
    price: 145000,
    originalPrice: 170000,
    rating: 4.6,
    reviews: 112,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    featured: true,
    vendor: "Fashion Hive",
  },

  {
    id: 8,
    name: "Adidas Running Shoes",
    category: "Fashion",
    subcategory: "Shoes",
    price: 125000,
    originalPrice: 150000,
    rating: 4.5,
    reviews: 82,
    stock: 17,
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600",
    featured: false,
    vendor: "Fashion Hive",
  },

  {
    id: 9,
    name: "Modern Office Chair",
    category: "Home & Living",
    subcategory: "Furniture",
    price: 250000,
    originalPrice: 300000,
    rating: 4.4,
    reviews: 48,
    stock: 11,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    featured: false,
    vendor: "Home Store",
  },

  {
    id: 10,
    name: "Smart LED TV",
    category: "Electronics",
    subcategory: "Televisions",
    price: 650000,
    originalPrice: 720000,
    rating: 4.6,
    reviews: 39,
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
    featured: true,
    vendor: "TechNest",
  },

  {
    id: 11,
    name: "Canon EOS Camera",
    category: "Electronics",
    subcategory: "Cameras",
    price: 920000,
    originalPrice: 1000000,
    rating: 4.8,
    reviews: 41,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
    featured: false,
    vendor: "Camera World",
  },

  {
    id: 12,
    name: "Smart Watch Series 9",
    category: "Electronics",
    subcategory: "Wearables",
    price: 320000,
    originalPrice: 370000,
    rating: 4.5,
    reviews: 71,
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    featured: true,
    vendor: "TechNest",
  },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function CategoryPage() {
  const { category, subcategory } = useParams();

  // IMPORTANT:
  // Get addToCart from AuthContext
  const { addToCart } = useAuth();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [wishlist, setWishlist] = useState([]);

  // =====================================================
  // FORMAT URL NAME
  // =====================================================

  const formatName = (value) => {
    if (!value) return "";

    return value
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  const categoryName = formatName(category);
  const subcategoryName = formatName(subcategory);

  // =====================================================
  // FILTER + SORT PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // -------------------------------------------------
    // IMPORTANT:
    // Filter according to URL category/subcategory
    // -------------------------------------------------

    if (category) {
      result = result.filter(
        (product) =>
          product.category.toLowerCase() ===
          categoryName.toLowerCase()
      );
    }

    if (subcategory) {
      result = result.filter(
        (product) =>
          product.subcategory.toLowerCase() ===
          subcategoryName.toLowerCase()
      );
    }

    // -------------------------------------------------
    // Search
    // -------------------------------------------------

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchValue)
      );
    }

    // -------------------------------------------------
    // Minimum price
    // -------------------------------------------------

    if (minPrice) {
      result = result.filter(
        (product) =>
          product.price >= Number(minPrice)
      );
    }

    // -------------------------------------------------
    // Maximum price
    // -------------------------------------------------

    if (maxPrice) {
      result = result.filter(
        (product) =>
          product.price <= Number(maxPrice)
      );
    }

    // -------------------------------------------------
    // Sorting
    // -------------------------------------------------

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "newest") {
      result.sort((a, b) => b.id - a.id);
    } else {
      result.sort(
        (a, b) =>
          Number(b.featured) -
          Number(a.featured)
      );
    }

    return result;
  }, [
    category,
    subcategory,
    categoryName,
    subcategoryName,
    search,
    sort,
    minPrice,
    maxPrice,
  ]);

  // =====================================================
  // WISHLIST
  // =====================================================

  const toggleWishlist = (id) => {
    setWishlist((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id
        );
      }

      return [...current, id];
    });
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
  };

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-RW").format(price);
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = (product) => {
    console.log("Adding product to cart:", product);

    addToCart(product);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">

        <span className="hover:text-indigo-600 cursor-pointer">
          Home
        </span>

        <span>/</span>

        <span className="hover:text-indigo-600 cursor-pointer">
          {categoryName}
        </span>

        <span>/</span>

        <span className="text-gray-900 font-semibold">
          {subcategoryName}
        </span>

      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                {subcategoryName}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Explore the best{" "}
                {subcategoryName.toLowerCase()} products.
              </p>

            </div>

          </div>

        </div>

        {/* SEARCH */}

        <div className="relative w-full lg:w-80">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder={`Search ${subcategoryName}...`}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              pl-10
              pr-4
              py-3
              bg-white
              border
              border-gray-200
              rounded-xl
              text-sm
              outline-none
              focus:ring-2
              focus:ring-indigo-100
              focus:border-indigo-400
            "
          />

        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className={`
                flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                border
                text-sm
                font-medium
                transition

                ${
                  showFilters
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }
              `}
            >

              <SlidersHorizontal size={16} />

              Filters

            </button>

            <span className="text-sm text-gray-500">

              <strong className="text-gray-900">
                {filteredProducts.length}
              </strong>{" "}
              products

            </span>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-3">

            {/* SORT */}

            <div className="relative">

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="
                  appearance-none
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-xl
                  pl-4
                  pr-9
                  py-2.5
                  text-sm
                  text-gray-600
                  font-medium
                  outline-none
                "
              >

                <option value="featured">
                  Featured
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Highest Rated
                </option>

              </select>

              <ChevronDown
                size={15}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  pointer-events-none
                  text-gray-400
                "
              />

            </div>

            {/* VIEW */}

            <div className="hidden sm:flex border border-gray-200 rounded-xl overflow-hidden">

              <button
                onClick={() =>
                  setViewMode("grid")
                }
                className={`
                  p-2.5
                  ${
                    viewMode === "grid"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-400"
                  }
                `}
              >
                <Grid3X3 size={17} />
              </button>

              <button
                onClick={() =>
                  setViewMode("list")
                }
                className={`
                  p-2.5
                  ${
                    viewMode === "list"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-400"
                  }
                `}
              >
                <List size={17} />
              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            FILTER PANEL
        ================================================= */}

        {showFilters && (

          <div className="border-t border-gray-100 mt-4 pt-4">

            <div className="flex flex-col sm:flex-row gap-4">

              <div>

                <label className="block text-xs font-semibold text-gray-500 mb-2">
                  Minimum Price
                </label>

                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value)
                  }
                  className="
                    w-full
                    sm:w-48
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                  "
                />

              </div>

              <div>

                <label className="block text-xs font-semibold text-gray-500 mb-2">
                  Maximum Price
                </label>

                <input
                  type="number"
                  placeholder="e.g. 1000000"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value)
                  }
                  className="
                    w-full
                    sm:w-48
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                  "
                />

              </div>

              <button
                onClick={clearFilters}
                className="
                  self-end
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-red-500
                  font-medium
                  px-3
                  py-2
                "
              >

                <X size={15} />

                Clear

              </button>

            </div>

          </div>

        )}

      </div>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      {filteredProducts.length > 0 ? (

        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "space-y-4"
          }
        >

          {filteredProducts.map((product) => (

            <ProductCard
              key={product.id}
              product={product}

              /*
               * THIS IS THE IMPORTANT PART.
               *
               * We pass the AuthProvider function
               * into ProductCard.
               */
              onAddToCart={handleAddToCart}

              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              viewMode={viewMode}
            />

          ))}

        </div>

      ) : (

        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">

          <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />

          <h2 className="text-lg font-bold text-gray-900">
            No products found
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Try changing your search or filters.
          </p>

          <button
            onClick={clearFilters}
            className="
              mt-5
              px-5
              py-2.5
              bg-indigo-600
              text-white
              rounded-xl
              text-sm
              font-semibold
              hover:bg-indigo-700
            "
          >
            Clear Filters
          </button>

        </div>

      )}

      {/* =================================================
          PAGINATION
      ================================================= */}

      {filteredProducts.length > 0 && (

        <div className="flex justify-center items-center gap-2 mt-8">

          <button className="w-10 h-10 rounded-xl border border-gray-200 text-gray-400">
            ←
          </button>

          <button className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-semibold">
            1
          </button>

          <button className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
            2
          </button>

          <button className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
            3
          </button>

          <button className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600">
            →
          </button>

        </div>

      )}

    </div>
  );
}
