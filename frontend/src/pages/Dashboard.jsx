import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Megaphone,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  Minus,
} from "lucide-react";


// =====================================================
// DUMMY DATA
// =====================================================

const stats = [
  {
    title: "Total Revenue",
    value: "RWF 24.6M",
    change: "+12.5%",
    icon: DollarSign,
  },
  {
    title: "Total Orders",
    value: "1,248",
    change: "+8.2%",
    icon: ShoppingCart,
  },
  {
    title: "Total Products",
    value: "3,842",
    change: "+5.4%",
    icon: Package,
  },
  {
    title: "Customers",
    value: "8,421",
    change: "+14.1%",
    icon: Users,
  },
];


const inventory = [
  {
    category: "Electronics",
    stock: 1245,
    percentage: 82,
  },
  {
    category: "Fashion & Apparel",
    stock: 823,
    percentage: 68,
  },
  {
    category: "Home & Living",
    stock: 512,
    percentage: 52,
  },
  {
    category: "Health & Beauty",
    stock: 342,
    percentage: 39,
  },
  {
    category: "Sports & Outdoors",
    stock: 286,
    percentage: 31,
  },
];


// =====================================================
// PRODUCTS
// =====================================================

const initialProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Electronics",
    price: 1250000,
    originalPrice: 1400000,
    stock: 25,
    sold: 342,
    rating: 4.8,
    vendor: "TechNest",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80",
  },

  {
    id: 2,
    name: "Samsung Galaxy S25",
    category: "Electronics",
    price: 980000,
    originalPrice: 1100000,
    stock: 18,
    sold: 287,
    rating: 4.7,
    vendor: "TechNest",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80",
  },

  {
    id: 3,
    name: "Nike Air Max",
    category: "Fashion & Apparel",
    price: 145000,
    originalPrice: 180000,
    stock: 42,
    sold: 241,
    rating: 4.6,
    vendor: "Fashion Hive",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  },

  {
    id: 4,
    name: "Modern Office Chair",
    category: "Home & Living",
    price: 250000,
    originalPrice: 300000,
    stock: 12,
    sold: 198,
    rating: 4.5,
    vendor: "Home Store",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
  },

  {
    id: 5,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 120000,
    originalPrice: 150000,
    stock: 8,
    sold: 156,
    rating: 4.4,
    vendor: "TechNest",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
];


const orders = [
  {
    id: "#ORD-1024",
    customer: "Jean Claude",
    product: "iPhone 15 Pro",
    amount: 1250000,
    status: "Delivered",
  },
  {
    id: "#ORD-1023",
    customer: "Alice Uwase",
    product: "Nike Air Max",
    amount: 145000,
    status: "Processing",
  },
  {
    id: "#ORD-1022",
    customer: "David Niyonzima",
    product: "Samsung Galaxy S25",
    amount: 980000,
    status: "Pending",
  },
  {
    id: "#ORD-1021",
    customer: "Grace Mukamana",
    product: "Office Chair",
    amount: 250000,
    status: "Shipped",
  },
  {
    id: "#ORD-1020",
    customer: "Eric Habimana",
    product: "Wireless Headphones",
    amount: 120000,
    status: "Cancelled",
  },
];


const activities = [
  {
    title: "New order received",
    description: "Order #ORD-1024 was placed",
    time: "10 minutes ago",
    icon: ShoppingCart,
  },
  {
    title: "New product added",
    description: "iPhone 15 Pro was added",
    time: "42 minutes ago",
    icon: Package,
  },
  {
    title: "Advertisement approved",
    description: "Electronics campaign is active",
    time: "1 hour ago",
    icon: Megaphone,
  },
  {
    title: "Low stock warning",
    description: "Wireless Headphones are low",
    time: "2 hours ago",
    icon: AlertTriangle,
  },
];


// =====================================================
// MAIN DASHBOARD
// =====================================================

export default function Dashboard() {

  const { user, addToCart } = useAuth();

  const [period, setPeriod] = useState("30 days");

  const [products, setProducts] = useState(initialProducts);

  /*
   * IMPORTANT
   *
   * Your AuthProvider stores the logged-in user.
   * We use the role to decide what the dashboard shows.
   */
  const isAdmin =
    user?.role === "admin" ||
    user?.isAdmin === true;

  const isBuyer = !isAdmin;


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-RW").format(value);
  };


  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = (product) => {

    if (isAdmin) {
      return;
    }

    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    addToCart(product);

    alert(`${product.name} added to cart.`);
  };


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDeleteProduct = (productId) => {

    if (!isAdmin) {
      return;
    }

    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${product.name}?`
    );

    if (!confirmed) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (item) => item.id !== productId
      )
    );
  };


  // =====================================================
  // UPDATE STOCK
  // =====================================================

  const handleUpdateStock = (productId, amount) => {

    if (!isAdmin) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) => {

        if (product.id !== productId) {
          return product;
        }

        return {
          ...product,
          stock: Math.max(
            0,
            product.stock + amount
          ),
        };

      })
    );
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-sm text-gray-400">
            Dashboard
          </p>

          <h1 className="text-2xl font-bold text-gray-900">

            {isAdmin
              ? "Welcome back, Admin 👋"
              : `Welcome back${user?.name ? `, ${user.name}` : ""} 👋`
            }

          </h1>

          <p className="text-sm text-gray-500 mt-1">

            {isAdmin
              ? "Here's what's happening across your store today."
              : "Browse products and shop from your favorite stores."
            }

          </p>

        </div>


        <div className="flex items-center gap-3">

          <select
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value)
            }
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
          >
            <option>7 days</option>
            <option>30 days</option>
            <option>12 months</option>
          </select>


          {/* ADMIN ONLY */}

          {isAdmin && (

            <Link
              to="/admin/post-product"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />

              Add Product

            </Link>

          )}

        </div>

      </div>


      {/* =================================================
          ADMIN STATISTICS
      ================================================= */}

      {isAdmin && (

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (

              <div
                key={stat.title}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

                    <Icon className="w-5 h-5" />

                  </div>


                  <div className="flex items-center gap-1 text-xs font-semibold text-green-600">

                    <TrendingUp className="w-3 h-3" />

                    {stat.change}

                  </div>

                </div>


                <p className="text-sm text-gray-500 mt-5">
                  {stat.title}
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>

              </div>

            );

          })}

        </div>

      )}


      {/* =================================================
          BUYER PRODUCT SECTION
      ================================================= */}

      {isBuyer && (

        <div>

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs uppercase font-semibold text-gray-400">
                Shop
              </p>

              <h2 className="text-xl font-bold text-gray-900">
                Featured Products
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Browse our latest products and add them to your cart.
              </p>

            </div>


            <Link
              to="/shop"
              className="flex items-center gap-1 text-sm font-semibold text-indigo-600"
            >

              View all

              <ArrowRight className="w-4 h-4" />

            </Link>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {products.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />

            ))}

          </div>

        </div>

      )}


      {/* =================================================
          ADMIN PRODUCT MANAGEMENT
      ================================================= */}

      {isAdmin && (

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          <div className="p-5 flex items-center justify-between">

            <div>

              <p className="text-xs uppercase font-semibold text-gray-400">
                Product Management
              </p>

              <h2 className="text-lg font-bold text-gray-900">
                Manage Products
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Update stock, edit or remove products.
              </p>

            </div>


            <Link
              to="/admin/post-product"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700"
            >

              <Plus className="w-4 h-4" />

              Add Product

            </Link>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-50 border-y border-gray-100">

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                    Product
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                    Category
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                    Price
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                    Stock
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                    Sold
                  </th>

                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {products.map((product) => (

                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >

                    {/* PRODUCT */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />

                        <div>

                          <p className="text-sm font-semibold text-gray-800">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {product.vendor}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {product.category}
                    </td>


                    {/* PRICE */}

                    <td className="px-5 py-4 text-sm font-bold text-gray-900">

                      RWF {formatMoney(product.price)}

                    </td>


                    {/* STOCK */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <button
                          onClick={() =>
                            handleUpdateStock(
                              product.id,
                              -1
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          title="Decrease stock"
                        >

                          <Minus className="w-3 h-3" />

                        </button>


                        <span
                          className={`text-sm font-bold min-w-[30px] text-center ${
                            product.stock <= 5
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </span>


                        <button
                          onClick={() =>
                            handleUpdateStock(
                              product.id,
                              1
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          title="Increase stock"
                        >

                          <Plus className="w-3 h-3" />

                        </button>

                      </div>

                    </td>


                    {/* SOLD */}

                    <td className="px-5 py-4 text-sm font-semibold text-gray-700">

                      {product.sold}

                    </td>


                    {/* ACTIONS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        <Link
                          to={`/admin/edit-product/${product.id}`}
                          className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center"
                          title="Edit product"
                        >

                          <Edit className="w-4 h-4" />

                        </Link>


                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              product.id
                            )
                          }
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center"
                          title="Delete product"
                        >

                          <Trash2 className="w-4 h-4" />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}


      {/* =================================================
          ADMIN SALES + ORDER STATUS
      ================================================= */}

      {isAdmin && (

        <>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* SALES */}

            <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-xs uppercase font-semibold text-gray-400">
                    Sales
                  </p>

                  <h2 className="text-lg font-bold text-gray-900">
                    Sales overview
                  </h2>

                </div>

                <TrendingUp className="w-5 h-5 text-indigo-500" />

              </div>


              <div className="h-64 flex items-end gap-4">

                {[45, 62, 52, 75, 68, 92, 80].map(
                  (height, index) => (

                    <div
                      key={index}
                      className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                    >

                      <div
                        className="w-full max-w-[45px] bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition"
                        style={{
                          height: `${height}%`,
                        }}
                      />

                      <span className="text-xs text-gray-400">

                        {
                          [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ][index]
                        }

                      </span>

                    </div>

                  )
                )}

              </div>


              <div className="border-t border-gray-100 mt-5 pt-5 flex items-center justify-between">

                <div>

                  <p className="text-xs text-gray-400">
                    Total revenue
                  </p>

                  <p className="text-xl font-bold text-gray-900">
                    RWF 24.6M
                  </p>

                </div>


                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">

                  <TrendingUp className="w-4 h-4" />

                  12.5%

                </div>

              </div>

            </div>


            {/* ORDER STATUS */}

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-xs uppercase font-semibold text-gray-400">
                    Orders
                  </p>

                  <h2 className="text-lg font-bold text-gray-900">
                    Order status
                  </h2>

                </div>

                <ShoppingCart className="w-5 h-5 text-indigo-500" />

              </div>


              <div className="space-y-5">

                <OrderStatus
                  label="Delivered"
                  value="642"
                  percentage="70"
                  icon={CheckCircle}
                  color="green"
                />

                <OrderStatus
                  label="Processing"
                  value="218"
                  percentage="45"
                  icon={Clock}
                  color="blue"
                />

                <OrderStatus
                  label="Pending"
                  value="124"
                  percentage="30"
                  icon={Clock}
                  color="yellow"
                />

                <OrderStatus
                  label="Cancelled"
                  value="32"
                  percentage="10"
                  icon={XCircle}
                  color="red"
                />

              </div>


              <Link
                to="/orders"
                className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-sm text-indigo-600 font-semibold"
              >

                View all orders

                <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

          </div>


          {/* =================================================
              INVENTORY + ADVERTISEMENTS
          ================================================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* INVENTORY */}

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-xs uppercase font-semibold text-gray-400">
                    Inventory
                  </p>

                  <h2 className="text-lg font-bold text-gray-900">
                    Stock by category
                  </h2>

                </div>

                <Package className="w-5 h-5 text-indigo-500" />

              </div>


              <div className="space-y-5">

                {inventory.map((item) => (

                  <div key={item.category}>

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-sm font-semibold text-gray-700">
                        {item.category}
                      </span>

                      <span className="text-xs text-gray-400">
                        {item.stock} items
                      </span>

                    </div>


                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>


              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100">

                <div>

                  <p className="text-xs text-gray-400">
                    In Stock
                  </p>

                  <p className="text-lg font-bold text-green-600">
                    3,208
                  </p>

                </div>


                <div>

                  <p className="text-xs text-gray-400">
                    Low Stock
                  </p>

                  <p className="text-lg font-bold text-yellow-600">
                    186
                  </p>

                </div>


                <div>

                  <p className="text-xs text-gray-400">
                    Out of Stock
                  </p>

                  <p className="text-lg font-bold text-red-600">
                    48
                  </p>

                </div>

              </div>

            </div>


            {/* ADVERTISEMENTS */}

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-xs uppercase font-semibold text-gray-400">
                    Advertising
                  </p>

                  <h2 className="text-lg font-bold text-gray-900">
                    Advertisement overview
                  </h2>

                </div>

                <Megaphone className="w-5 h-5 text-indigo-500" />

              </div>


              <div className="grid grid-cols-2 gap-4">

                <AdCard
                  label="Active Ads"
                  value="24"
                  icon={CheckCircle}
                  color="green"
                />

                <AdCard
                  label="Pending Ads"
                  value="7"
                  icon={Clock}
                  color="yellow"
                />

                <AdCard
                  label="Rejected Ads"
                  value="3"
                  icon={XCircle}
                  color="red"
                />

                <AdCard
                  label="Expired Ads"
                  value="13"
                  icon={Clock}
                  color="gray"
                />

              </div>


              <div className="bg-gray-50 rounded-xl p-4 mt-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs text-gray-500">
                      Total impressions
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      48.2K
                    </p>

                  </div>

                  <Eye className="w-5 h-5 text-gray-400" />

                </div>


                <div className="h-2 bg-gray-200 rounded-full mt-4">

                  <div className="h-full w-[72%] bg-indigo-500 rounded-full" />

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RECENT ORDERS
          ================================================= */}

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

            <div className="p-5 flex items-center justify-between">

              <div>

                <p className="text-xs uppercase font-semibold text-gray-400">
                  Orders
                </p>

                <h2 className="text-lg font-bold text-gray-900">
                  Recent orders
                </h2>

              </div>


              <Link
                to="/orders"
                className="flex items-center gap-1 text-sm font-semibold text-indigo-600"
              >

                View all

                <ArrowRight className="w-4 h-4" />

              </Link>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-50 border-y border-gray-100">

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                      Order
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                      Customer
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                      Product
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                      Amount
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {orders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 text-sm font-bold text-indigo-600">
                        {order.id}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                        {order.customer}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {order.product}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-gray-900">
                        RWF {formatMoney(order.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <QuickAction
              to="/admin/post-product"
              icon={Plus}
              title="Add Product"
              description="Add a new product"
            />

            <QuickAction
              to="/ads"
              icon={Megaphone}
              title="Create Advertisement"
              description="Promote your products"
            />

            <QuickAction
              to="/orders"
              icon={ShoppingCart}
              title="Manage Orders"
              description="View customer orders"
            />

            <QuickAction
              to="/analytics"
              icon={TrendingUp}
              title="View Analytics"
              description="Analyze store performance"
            />

          </div>

        </>

      )}

    </div>
  );
}


// =====================================================
// PRODUCT CARD
// =====================================================

function ProductCard({
  product,
  onAddToCart,
}) {

  const {
    name,
    price,
    originalPrice,
    image,
    category,
    rating,
    vendor,
    stock,
  } = product;


  return (

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">

      {/* IMAGE */}

      <div className="relative h-48 bg-gray-100">

        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />

        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
          {category}
        </span>

      </div>


      {/* INFO */}

      <div className="p-4 flex-1">

        <p className="text-xs text-gray-400 mb-1">
          By {vendor}
        </p>

        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {name}
        </h3>


        <div className="flex items-center gap-1 mt-2">

          <span className="text-yellow-500">
            ★
          </span>

          <span className="text-xs font-semibold text-gray-700">
            {rating}
          </span>

        </div>


        <div className="mt-3">

          <span className="text-lg font-black text-gray-900">
            RWF {Number(price).toLocaleString()}
          </span>

          {originalPrice && (

            <span className="text-xs text-gray-400 line-through ml-2">
              RWF {Number(originalPrice).toLocaleString()}
            </span>

          )}

        </div>


        <p
          className={`text-xs font-medium mt-2 ${
            stock <= 5
              ? "text-red-500"
              : "text-green-600"
          }`}
        >

          {stock <= 5
            ? `Only ${stock} left`
            : `${stock} in stock`}

        </p>

      </div>


      {/* BUY BUTTON */}

      <div className="p-4 pt-0">

        <button
          onClick={() =>
            onAddToCart(product)
          }
          disabled={stock === 0}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
            stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >

          <ShoppingCart className="w-4 h-4" />

          {stock === 0
            ? "Out of Stock"
            : "Add to Cart"}

        </button>

      </div>

    </div>

  );
}


// =====================================================
// ORDER STATUS
// =====================================================

function OrderStatus({
  label,
  value,
  percentage,
  icon: Icon,
  color,
}) {

  const colors = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };


  return (

    <div>

      <div className="flex items-center justify-between mb-2">

        <div className="flex items-center gap-2">

          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}
          >

            <Icon className="w-4 h-4" />

          </div>

          <span className="text-sm font-semibold text-gray-700">
            {label}
          </span>

        </div>


        <span className="text-sm font-bold text-gray-900">
          {value}
        </span>

      </div>


      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-indigo-500 rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>

  );
}


// =====================================================
// AD CARD
// =====================================================

function AdCard({
  label,
  value,
  icon: Icon,
  color,
}) {

  const colors = {
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-100 text-gray-600",
  };


  return (

    <div className="border border-gray-100 rounded-xl p-4">

      <div className="flex items-center justify-between">

        <span className="text-xs text-gray-500">
          {label}
        </span>


        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}
        >

          <Icon className="w-4 h-4" />

        </div>

      </div>


      <p className="text-2xl font-bold text-gray-900 mt-3">
        {value}
      </p>

    </div>

  );
}


// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {

  const styles = {
    Delivered: "bg-green-50 text-green-700",
    Processing: "bg-blue-50 text-blue-700",
    Pending: "bg-yellow-50 text-yellow-700",
    Shipped: "bg-indigo-50 text-indigo-700",
    Cancelled: "bg-red-50 text-red-700",
  };


  return (

    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] ||
        "bg-gray-50 text-gray-600"
      }`}
    >
      {status}
    </span>

  );
}


// =====================================================
// QUICK ACTION
// =====================================================

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}) {

  return (

    <Link
      to={to}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-indigo-200 hover:shadow-sm transition"
    >

      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">

        <Icon className="w-5 h-5" />

      </div>


      <div>

        <p className="text-sm font-bold text-gray-800">
          {title}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {description}
        </p>

      </div>

    </Link>

  );
}