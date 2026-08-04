import React, {
  createContext,
  useContext,
  useState
} from 'react';


// =====================================================
// CONTEXT
// =====================================================

const AuthContext = createContext(null);


// =====================================================
// PROVIDER
// =====================================================

export function AuthProvider({ children }) {

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] = useState(() => {

    try {

      const storedUser =
        localStorage.getItem('user');

      return storedUser
        ? JSON.parse(storedUser)
        : null;

    } catch (error) {

      console.error(
        'Failed to parse user:',
        error
      );

      return null;
    }

  });


  // =====================================================
  // CART
  // =====================================================

  const [cartItems, setCartItems] = useState([]);


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Shipped! 📦',
      message:
        'Your TechNest order #4920 is on the way.',
      time: '10 mins ago',
      read: false
    },
    {
      id: 2,
      title: 'Flash Sale Active 🔥',
      message:
        'Get up to 40% off on Fashion Hive items today.',
      time: '1 hour ago',
      read: false
    }
  ]);


  // =====================================================
  // LOGIN
  // =====================================================

  const login = (userData) => {

    setUser(userData);

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    setUser(null);

    localStorage.removeItem('user');

    setCartItems([]);

    setNotifications([]);

  };


  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (product) => {

    console.log(
      'ADD TO CART:',
      product
    );

    setCartItems((currentItems) => {

      // -----------------------------------------------
      // CHECK IF PRODUCT ALREADY EXISTS
      // -----------------------------------------------

      const existingItem =
        currentItems.find(
          (item) =>
            item.id === product.id
        );


      // -----------------------------------------------
      // PRODUCT EXISTS
      // -----------------------------------------------

      if (existingItem) {

        return currentItems.map(
          (item) => {

            if (
              item.id === product.id
            ) {

              return {
                ...item,
                quantity:
                  (item.quantity || 1) + 1
              };

            }

            return item;

          }
        );

      }


      // -----------------------------------------------
      // NEW PRODUCT
      // -----------------------------------------------

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1
        }
      ];

    });

  };


  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeCartItem = (id) => {

    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== id
        )
    );

  };


  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseCartQuantity = (id) => {

    setCartItems(
      (currentItems) =>

        currentItems.map(
          (item) => {

            if (
              item.id === id
            ) {

              return {
                ...item,
                quantity:
                  (item.quantity || 1) + 1
              };

            }

            return item;

          }
        )

    );

  };


  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseCartQuantity = (id) => {

    setCartItems(
      (currentItems) =>

        currentItems

          .map((item) => {

            if (
              item.id === id
            ) {

              return {
                ...item,
                quantity:
                  Math.max(
                    (item.quantity || 1) - 1,
                    0
                  )
              };

            }

            return item;

          })

          .filter(
            (item) =>
              item.quantity > 0
          )

    );

  };


  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = () => {

    setCartItems([]);

  };


  // =====================================================
  // CART SUBTOTAL
  // =====================================================

  const cartSubtotal =
    cartItems
      .reduce(
        (total, item) => {

          return (
            total +
            Number(item.price) *
            (item.quantity || 1)
          );

        },
        0
      )
      .toFixed(2);


  // =====================================================
  // CART COUNT
  // =====================================================

  const cartCount =
    cartItems.reduce(
      (total, item) => {

        return (
          total +
          (item.quantity || 1)
        );

      },
      0
    );


  // =====================================================
  // NOTIFICATION READ
  // =====================================================

  const markAllNotificationsAsRead =
    () => {

      setNotifications(
        (currentNotifications) =>

          currentNotifications.map(
            (notification) => ({
              ...notification,
              read: true
            })
          )

      );

    };


  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;


  // =====================================================
  // PROVIDER
  // =====================================================

  return (

    <AuthContext.Provider
      value={{

        // USER
        user,
        login,
        logout,

        // CART
        cartItems,
        addToCart,
        removeCartItem,
        increaseCartQuantity,
        decreaseCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,

        // NOTIFICATIONS
        notifications,
        markAllNotificationsAsRead,
        unreadCount

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAuth() {

  return useContext(AuthContext);

}
