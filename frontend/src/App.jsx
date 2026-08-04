import React from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';

import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import CategoryPage from './pages/CategoryPage';
import CategoryDetail from './pages/CategoryDetail';
import Register from './pages/Register';
import CartPage from './pages/Carts';

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ children }) {

  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


// =====================================================
// APP
// =====================================================

export default function App() {

  return (

    <Routes>

      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =================================================
          PROTECTED ROUTES
      ================================================= */}

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        {/* HOME */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={<Analytics />}
        />


        {/* =================================================
            CATEGORY + SUBCATEGORY
        ================================================= */}

        <Route
          path="/categories/:category/:subcategory"
          element={<CategoryPage />}
        />


        {/* =================================================
            CATEGORY DETAIL
        ================================================= */}

        <Route
          path="/category/:categoryId"
          element={<CategoryDetail />}
        />


        {/* =================================================
            SHOP
        ================================================= */}

        <Route
          path="/shop"
          element={
            <div className="p-4">
              Shop Content
            </div>
          }
        />


        {/* =================================================
            PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={
            <div className="p-4">
              Profile Content
            </div>
          }
        />


        {/* =================================================
            ORDERS
        ================================================= */}

        <Route
          path="/orders"
          element={
            <div className="p-4">
              Orders Content
            </div>
          }
        />


        {/* =================================================
            SETTINGS
        ================================================= */}

        <Route
          path="/settings"
          element={
            <div className="p-4">
              Settings Content
            </div>
          }
        />


        {/* =================================================
            CART
        ================================================= */}

        <Route
          path="/cart"
          element={
            <CartPage />
          }
        />

      </Route>


      {/* =================================================
          FALLBACK
      ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>

  );

}
