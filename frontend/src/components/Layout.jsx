
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

import {
  ShoppingCart,
  User,
  Bell,
  Settings,
  LogOut,
  Package,  
  Trash2,
  ArrowRight
} from 'lucide-react';

import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';


export default function Layout() {

  // --------------------------------------------------
  // ROUTER
  // --------------------------------------------------

  const navigate = useNavigate();


  // --------------------------------------------------
  // AUTH / GLOBAL STATE
  // --------------------------------------------------

  const {
    user,
    logout,
    cartItems,
    removeCartItem,
    cartSubtotal,
    notifications,
    markAllNotificationsAsRead,
    unreadCount
  } = useAuth();


  // --------------------------------------------------
  // LOCAL STATE
  // --------------------------------------------------

  const [activeTab, setActiveTab] = useState('dashboard');

  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownRef = useRef(null);


  // --------------------------------------------------
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // --------------------------------------------------

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }

    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };

  }, []);


  // --------------------------------------------------
  // DROPDOWN TOGGLE
  // --------------------------------------------------

  const toggleDropdown = (name) => {

    setActiveDropdown(
      activeDropdown === name
        ? null
        : name
    );

  };


  // --------------------------------------------------
  // NORMAL MENU NAVIGATION
  // --------------------------------------------------

  const handleTabChange = (tabId) => {
  setActiveTab(tabId);
  setActiveDropdown(null);

  if (tabId === 'dashboard') {
    navigate('/dashboard');
    return;
  }

  if (tabId === 'analytics') {
    navigate('/analytics');
    return;
  }

  if (
    [
      'explore',
      'fashion-hive',
      'health-mart',
      'technest'
    ].includes(tabId)
  ) {
    navigate('/shop');
    return;
  }

  if (tabId === 'help') {
    navigate('/help');
    return;
  }
};


  // --------------------------------------------------
  // SUBCATEGORY NAVIGATION
  // --------------------------------------------------

  const handleCategoryNavigation = (path) => {

    setActiveDropdown(null);

    /*
      path comes from Sidebar.

      Example:

      /categories/electronics/phones

      /categories/electronics/laptops

      /categories/fashion/shoes
    */

    navigate(path);

  };


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div className="min-h-screen bg-gray-50 flex">


      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <Sidebar
        userRole={
          user?.isAdmin
            ? 'admin'
            : 'buyer'
        }

        activeTab={activeTab}

        setActiveTab={handleTabChange}


        onNavigate={handleCategoryNavigation}
      />


      {/* ================================================= */}
      {/* MAIN APPLICATION AREA */}
      {/* ================================================= */}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">


        {/* ================================================= */}
        {/* TOP NAVBAR */}
        {/* ================================================= */}

        <header className="
          bg-white
          border-b
          border-gray-100
          sticky
          top-0
          z-40
          px-8
          h-16
          flex
          items-center
          justify-between
        ">


          {/* --------------------------------------------- */}
          {/* BREADCRUMB */}
          {/* --------------------------------------------- */}

          <div className="
            flex
            items-center
            gap-4
            text-xs
            text-gray-500
          ">

            <span className="
              font-semibold
              text-gray-800
            ">
              Shopacla Platform
            </span>

            <span>/</span>

            <span className="capitalize">

              {activeTab}

            </span>

          </div>

          {/* RIGHT ACTIONS */}
          <div
            className="
              flex
              items-center
              gap-4
              relative
            "
            ref={dropdownRef}
          >
            {/* NOTIFICATIONS */}

            <div className="relative">

              <button
                onClick={() =>
                  toggleDropdown('notifications')
                }
                className={`
                  p-2
                  text-gray-400
                  hover:text-gray-600
                  relative
                  rounded-xl
                  hover:bg-gray-50
                  transition

                  ${
                    activeDropdown === 'notifications'
                      ? 'bg-gray-100 text-gray-600'
                      : ''
                  }
                `}
              >

                <Bell className="w-5 h-5" />


                {unreadCount > 0 && (

                  <span className="
                    absolute
                    top-1.5
                    right-1.5
                    w-2
                    h-2
                    bg-red-500
                    rounded-full
                    animate-pulse
                  " />

                )}

              </button>


              {activeDropdown === 'notifications' && (

                <div className="
                  absolute
                  right-0
                  mt-3
                  w-80
                  bg-white
                  rounded-2xl
                  shadow-xl
                  border
                  border-gray-100
                  py-3
                  z-50
                ">


                  {/* Header */}

                  <div className="
                    flex
                    items-center
                    justify-between
                    px-4
                    pb-3
                    border-b
                    border-gray-100
                  ">

                    <h3 className="
                      font-bold
                      text-sm
                      text-gray-800
                    ">
                      Notifications
                    </h3>


                    {unreadCount > 0 && (

                      <span className="
                        text-[10px]
                        bg-indigo-50
                        text-indigo-600
                        px-2
                        py-0.5
                        rounded-full
                        font-semibold
                      ">
                        {unreadCount} New
                      </span>

                    )}

                  </div>


                  {notifications.length === 0 ? (

                    <div className="
                      py-8
                      text-center
                      text-xs
                      text-gray-400
                    ">
                      No notifications found
                    </div>

                  ) : (

                    <>

                      <div className="
                        max-h-72
                        overflow-y-auto
                        divide-y
                        divide-gray-50
                      ">

                        {notifications.map((notif) => (

                          <div
                            key={notif.id}
                            className={`
                              px-4
                              py-3
                              hover:bg-gray-50
                              transition
                              cursor-pointer

                              ${
                                !notif.read
                                  ? 'bg-indigo-50/30'
                                  : ''
                              }
                            `}
                          >

                            <div className="
                              flex
                              items-start
                              justify-between
                              gap-2
                            ">

                              <p className="
                                text-xs
                                font-semibold
                                text-gray-800
                              ">
                                {notif.title}
                              </p>


                              {!notif.read && (

                                <span className="
                                  w-1.5
                                  h-1.5
                                  bg-indigo-600
                                  rounded-full
                                  mt-1
                                  flex-shrink-0
                                " />

                              )}

                            </div>


                            <p className="
                              text-[11px]
                              text-gray-500
                              mt-0.5
                            ">
                              {notif.message}
                            </p>


                            <span className="
                              text-[9px]
                              text-gray-400
                              mt-1
                              block
                            ">
                              {notif.time}
                            </span>

                          </div>

                        ))}

                      </div>


                      {unreadCount > 0 && (

                        <div className="
                          pt-2
                          px-4
                          border-t
                          border-gray-100
                          text-center
                        ">

                          <button
                            onClick={
                              markAllNotificationsAsRead
                            }
                            className="
                              text-xs
                              text-indigo-600
                              font-bold
                              hover:underline
                            "
                          >
                            Mark all as read
                          </button>

                        </div>

                      )}

                    </>

                  )}

                </div>

              )}

            </div>


            {/* ================================================= */}
            {/* CART */}
            {/* ================================================= */}

            <div className="relative">

              <button
                onClick={() =>
                  toggleDropdown('cart')
                }
                className={`
                  p-2
                  text-gray-400
                  hover:text-gray-600
                  relative
                  rounded-xl
                  hover:bg-gray-50
                  transition

                  ${
                    activeDropdown === 'cart'
                      ? 'bg-gray-100 text-gray-600'
                      : ''
                  }
                `}
              >

                <ShoppingCart className="w-5 h-5" />


                {cartItems.length > 0 && (

                  <span className="
                    absolute
                    -top-1
                    -right-1
                    bg-indigo-600
                    text-white
                    text-[10px]
                    w-4
                    h-4
                    rounded-full
                    flex
                    items-center
                    justify-center
                    font-bold
                  ">
                    {cartItems.length}
                  </span>

                )}

              </button>


              {activeDropdown === 'cart' && (

                <div className="
                  absolute
                  right-0
                  mt-3
                  w-80
                  bg-white
                  rounded-2xl
                  shadow-xl
                  border
                  border-gray-100
                  p-4
                  z-50
                ">


                  <div className="
                    flex
                    items-center
                    justify-between
                    pb-3
                    border-b
                    border-gray-100
                  ">

                    <h3 className="
                      font-bold
                      text-sm
                      text-gray-800
                    ">
                      Shopping Cart
                    </h3>

                    <span className="
                      text-xs
                      text-gray-500
                    ">
                      {cartItems.length} items
                    </span>

                  </div>


                  {cartItems.length === 0 ? (

                    <div className="
                      py-8
                      text-center
                      text-xs
                      text-gray-400
                    ">
                      Your cart is currently empty
                    </div>

                  ) : (

                    <>

                      <div className="
                        max-h-60
                        overflow-y-auto
                        divide-y
                        divide-gray-50
                        my-2
                      ">

                        {cartItems.map((item) => (

                          <div
                            key={item.id}
                            className="
                              py-2.5
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >

                            <div className="
                              w-10
                              h-10
                              bg-gray-100
                              rounded-lg
                              flex-shrink-0
                              flex
                              items-center
                              justify-center
                              text-gray-400
                              text-[10px]
                              font-bold
                            ">
                              {item.store}
                            </div>


                            <div className="
                              flex-1
                              min-w-0
                            ">

                              <p className="
                                text-xs
                                font-semibold
                                text-gray-800
                                truncate
                              ">
                                {item.name}
                              </p>

                              <p className="
                                text-[11px]
                                text-indigo-600
                                font-bold
                              ">
                                ${item.price}
                              </p>

                            </div>


                            <button
                              onClick={() =>
                                removeCartItem(item.id)
                              }
                              className="
                                text-gray-400
                                hover:text-red-500
                                transition
                              "
                            >

                              <Trash2 className="w-4 h-4" />

                            </button>

                          </div>

                        ))}

                      </div>


                      <div className="
                        pt-3
                        border-t
                        border-gray-100
                      ">

                        <div className="
                          flex
                          justify-between
                          items-center
                          mb-3
                        ">

                          <span className="
                            text-xs
                            text-gray-500
                          ">
                            Subtotal:
                          </span>

                          <span className="
                            text-sm
                            font-bold
                            text-gray-800
                          ">
                            ${cartSubtotal}
                          </span>

                        </div>


                        <Link
                          to="/cart"
                          onClick={() =>
                            setActiveDropdown(null)
                          }
                          className="
                            w-full
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            text-xs
                            font-bold
                            py-2.5
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition
                          "
                        >

                          View Cart & Checkout

                          <ArrowRight className="w-4 h-4" />

                        </Link>

                      </div>

                    </>

                  )}

                </div>

              )}

            </div>


            {/* ================================================= */}
            {/* ACCOUNT */}
            {/* ================================================= */}

            <div className="relative">

              {user ? (

                <button
                  onClick={() =>
                    toggleDropdown('account')
                  }
                  className={`
                    flex
                    items-center
                    gap-2.5
                    bg-indigo-50
                    hover:bg-indigo-100
                    text-indigo-600
                    px-3
                    py-1.5
                    rounded-xl
                    text-xs
                    font-bold
                    transition

                    ${
                      activeDropdown === 'account'
                        ? 'bg-indigo-100'
                        : ''
                    }
                  `}
                >

                  <div className="
                    w-6
                    h-6
                    rounded-full
                    bg-indigo-600
                    text-white
                    flex
                    items-center
                    justify-center
                    text-[10px]
                    font-bold
                  ">
                    {user.initials || user.name.charAt(0)}
                  </div>

                  <span className="
                    max-w-[100px]
                    truncate
                  ">
                    {user.name}
                  </span>

                </button>

              ) : (

                <Link
                  to="/login"
                  className="
                    flex
                    items-center
                    gap-2
                    bg-indigo-50
                    hover:bg-indigo-100
                    text-indigo-600
                    px-3.5
                    py-2
                    rounded-xl
                    text-xs
                    font-bold
                    transition
                  "
                >

                  <User className="w-4 h-4" />

                  Login

                </Link>

              )}


              {user &&
                activeDropdown === 'account' && (

                <div className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  bg-white
                  rounded-2xl
                  shadow-xl
                  border
                  border-gray-100
                  py-3
                  z-50
                ">


                  {/* Account information */}

                  <div className="
                    px-4
                    pb-3
                    border-b
                    border-gray-100
                    flex
                    items-center
                    gap-3
                  ">

                    <div className="
                      w-10
                      h-10
                      rounded-full
                      bg-indigo-600
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-sm
                    ">
                      {user.initials ||
                        user.name.charAt(0)}
                    </div>


                    <div className="overflow-hidden">

                      <p className="
                        text-xs
                        font-bold
                        text-gray-800
                        truncate
                      ">
                        {user.name}
                      </p>

                      <p className="
                        text-[11px]
                        text-gray-500
                        truncate
                      ">
                        {user.email}
                      </p>

                    </div>

                  </div>


                  {/* Account links */}

                  <div className="
                    py-2
                    text-xs
                    text-gray-600
                    divide-y
                    divide-gray-50
                  ">

                    <div className="
                      px-2
                      space-y-1
                    ">


                      <Link
                        to="/profile"
                        onClick={() =>
                          setActiveDropdown(null)
                        }
                        className="
                          flex
                          items-center
                          gap-2.5
                          px-3
                          py-2
                          rounded-xl
                          hover:bg-gray-50
                          transition
                          font-medium
                        "
                      >

                        <User className="
                          w-4
                          h-4
                          text-gray-400
                        " />

                        Profile Information

                      </Link>


                      <Link
                        to="/orders"
                        onClick={() =>
                          setActiveDropdown(null)
                        }
                        className="
                          flex
                          items-center
                          gap-2.5
                          px-3
                          py-2
                          rounded-xl
                          hover:bg-gray-50
                          transition
                          font-medium
                        "
                      >

                        <Package className="
                          w-4
                          h-4
                          text-gray-400
                        " />

                        My Orders

                      </Link>


                      <Link
                        to="/settings"
                        onClick={() =>
                          setActiveDropdown(null)
                        }
                        className="
                          flex
                          items-center
                          gap-2.5
                          px-3
                          py-2
                          rounded-xl
                          hover:bg-gray-50
                          transition
                          font-medium
                        "
                      >

                        <Settings className="
                          w-4
                          h-4
                          text-gray-400
                        " />

                        Settings & Security

                      </Link>

                    </div>


                    {/* Logout */}

                    <div className="
                      pt-2
                      px-2
                      mt-2
                    ">

                      <button
                        onClick={() => {

                          logout();

                          setActiveDropdown(null);

                          navigate('/login');

                        }}
                        className="
                          w-full
                          flex
                          items-center
                          gap-2.5
                          px-3
                          py-2
                          rounded-xl
                          text-red-600
                          hover:bg-red-50
                          transition
                          font-semibold
                          text-left
                        "
                      >

                        <LogOut className="w-4 h-4" />

                        Logout

                      </button>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </header>


        {/* ================================================= */}
        {/* PAGE CONTENT */}
        {/* ================================================= */}

        <main className="flex-1 p-8">

          <Outlet />

        </main>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <footer className="
          bg-white
          border-t
          border-gray-100
          py-6
          text-center
          text-xs
          text-gray-500
        ">

          &copy; {new Date().getFullYear()}

          {' '}

          Shopacla E-Commerce & Advertising Platform.

          All rights reserved.

        </footer>

      </div>

    </div>

  );
}
