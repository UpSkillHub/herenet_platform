import React from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeCartItem,
    clearCart,
    cartSubtotal,
    cartCount
  } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="max-w-6xl mx-auto mb-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear Cart
            </button>
          )}

        </div>

      </div>


      {/* ================================================= */}
      {/* EMPTY CART */}
      {/* ================================================= */}

      {cartItems.length === 0 ? (

        <div className="max-w-6xl mx-auto">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center justify-center">

            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <ShoppingBag className="w-9 h-9 text-gray-400" />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Add some products to your cart to see them here.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              Start Shopping
            </button>

          </div>

        </div>

      ) : (

        /* ================================================= */
        /* CART CONTENT */
        /* ================================================= */

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ============================================= */}
          {/* CART ITEMS */}
          {/* ============================================= */}

          <div className="lg:col-span-2 space-y-4">

            {cartItems.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
              >

                <div className="flex gap-4">

                  {/* PRODUCT IMAGE */}

                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">

                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />

                  </div>


                  {/* PRODUCT DETAILS */}

                  <div className="flex-1 min-w-0">

                    <div className="flex justify-between gap-4">

                      <div>

                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>

                        {item.vendor && (
                          <p className="text-xs text-gray-400 mt-1">
                            By {item.vendor}
                          </p>
                        )}

                        {item.category && (
                          <p className="text-xs text-gray-400 mt-1">
                            {item.category}
                          </p>
                        )}

                      </div>


                      {/* REMOVE */}

                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>


                    {/* PRICE + QUANTITY */}

                    <div className="flex items-center justify-between mt-5">

                      <div>

                        <p className="font-bold text-gray-900">
                          RWF {Number(item.price).toLocaleString()}
                        </p>

                        <p className="text-xs text-gray-400">
                          per item
                        </p>

                      </div>


                      {/* QUANTITY */}

                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">

                        <button
                          onClick={() =>
                            decreaseCartQuantity(item.id)
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-10 text-center text-sm font-semibold">
                          {item.quantity || 1}
                        </span>

                        <button
                          onClick={() =>
                            increaseCartQuantity(item.id)
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                      </div>


                      {/* ITEM TOTAL */}

                      <div className="text-right">

                        <p className="font-bold text-gray-900">
                          RWF {
                            (
                              Number(item.price) *
                              (item.quantity || 1)
                            ).toLocaleString()
                          }
                        </p>

                        <p className="text-xs text-gray-400">
                          Total
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>


          {/* ============================================= */}
          {/* ORDER SUMMARY */}
          {/* ============================================= */}

          <div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">

              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Order Summary
              </h2>


              {/* SUBTOTAL */}

              <div className="flex justify-between text-sm mb-3">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold text-gray-900">
                  RWF {Number(cartSubtotal).toLocaleString()}
                </span>

              </div>


              {/* SHIPPING */}

              <div className="flex justify-between text-sm mb-3">

                <span className="text-gray-500">
                  Shipping
                </span>

                <span className="font-semibold text-green-600">
                  Free
                </span>

              </div>


              <div className="border-t border-gray-100 my-4" />


              {/* TOTAL */}

              <div className="flex justify-between items-center mb-6">

                <span className="font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-black text-gray-900">
                  RWF {Number(cartSubtotal).toLocaleString()}
                </span>

              </div>


              {/* CHECKOUT */}

              <button
                onClick={() => {
                  alert('Checkout will be implemented next.');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
              >

                <ShoppingCart className="w-4 h-4" />

                Proceed to Checkout

              </button>


              {/* CONTINUE SHOPPING */}

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full mt-3 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold text-sm transition"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
