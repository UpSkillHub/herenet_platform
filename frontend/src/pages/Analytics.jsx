
import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Megaphone,
  Clock,
} from "lucide-react";


// =====================================================
// DUMMY DATA
// =====================================================

const performanceData = [
  { month: "Jan", revenue: 4200000, orders: 120 },
  { month: "Feb", revenue: 5100000, orders: 145 },
  { month: "Mar", revenue: 4700000, orders: 132 },
  { month: "Apr", revenue: 6300000, orders: 178 },
  { month: "May", revenue: 7200000, orders: 205 },
  { month: "Jun", revenue: 6800000, orders: 192 },
];


const topProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Electronics",
    sold: 342,
    revenue: 3420000,
    growth: 18.4,
  },
  {
    id: 2,
    name: "Samsung Galaxy S25",
    category: "Electronics",
    sold: 287,
    revenue: 2870000,
    growth: 14.2,
  },
  {
    id: 3,
    name: "Nike Air Max",
    category: "Fashion",
    sold: 241,
    revenue: 1446000,
    growth: 11.7,
  },
  {
    id: 4,
    name: "Modern Office Chair",
    category: "Home & Living",
    sold: 198,
    revenue: 990000,
    growth: 8.5,
  },
  {
    id: 5,
    name: "Wireless Headphones",
    category: "Electronics",
    sold: 176,
    revenue: 880000,
    growth: 6.3,
  },
];


const categoryPerformance = [
  {
    category: "Electronics",
    products: 1245,
    sold: 1842,
    revenue: 12400000,
    percentage: 82,
  },
  {
    category: "Fashion & Apparel",
    products: 823,
    sold: 1210,
    revenue: 6800000,
    percentage: 64,
  },
  {
    category: "Home & Living",
    products: 512,
    sold: 842,
    revenue: 4200000,
    percentage: 48,
  },
  {
    category: "Health & Beauty",
    products: 342,
    sold: 615,
    revenue: 2900000,
    percentage: 36,
  },
  {
    category: "Sports & Outdoors",
    products: 286,
    sold: 428,
    revenue: 1800000,
    percentage: 25,
  },
];


const recentSales = [
  {
    id: "#ORD-1024",
    customer: "Jean Claude",
    product: "iPhone 15 Pro",
    amount: 1250000,
    status: "Completed",
    date: "Today, 10:42 AM",
  },
  {
    id: "#ORD-1023",
    customer: "Alice Uwase",
    product: "Nike Air Max",
    amount: 145000,
    status: "Completed",
    date: "Today, 09:18 AM",
  },
  {
    id: "#ORD-1022",
    customer: "David Niyonzima",
    product: "Samsung Galaxy S25",
    amount: 980000,
    status: "Processing",
    date: "Yesterday",
  },
  {
    id: "#ORD-1021",
    customer: "Grace Mukamana",
    product: "Office Chair",
    amount: 250000,
    status: "Completed",
    date: "Yesterday",
  },
];


const adPerformance = [
  {
    name: "Summer Electronics Campaign",
    impressions: "24.8K",
    clicks: "3.2K",
    ctr: "12.9%",
  },
  {
    name: "Fashion Weekend Promotion",
    impressions: "18.4K",
    clicks: "2.1K",
    ctr: "11.4%",
  },
  {
    name: "Home & Living Deals",
    impressions: "12.7K",
    clicks: "1.4K",
    ctr: "11.0%",
  },
];


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function Analytics() {

  const [period, setPeriod] = useState("Last 30 days");


  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-RW").format(value);
  };


  const maxRevenue = Math.max(
    ...performanceData.map((item) => item.revenue)
  );


  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-sm text-gray-400">
            Dashboard / Analytics
          </p>

          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Store Analytics
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitor your store performance, sales and products.
          </p>

        </div>


        <div className="flex items-center gap-3">

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 12 months</option>
          </select>

        </div>

      </div>


      {/* =================================================
          KPI CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">


        <AnalyticsCard
          title="Total Revenue"
          value="RWF 24.6M"
          change="+12.5%"
          description="vs previous period"
          icon={DollarSign}
          positive
        />


        <AnalyticsCard
          title="Total Orders"
          value="1,248"
          change="+8.2%"
          description="vs previous period"
          icon={ShoppingBag}
          positive
        />


        <AnalyticsCard
          title="Products Sold"
          value="3,842"
          change="+15.4%"
          description="vs previous period"
          icon={Package}
          positive
        />


        <AnalyticsCard
          title="Customers"
          value="8,421"
          change="+9.7%"
          description="vs previous period"
          icon={Users}
          positive
        />

      </div>


      {/* =================================================
          REVENUE PERFORMANCE
      ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">


        {/* REVENUE CHART */}

        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>

              <p className="text-xs uppercase font-semibold text-gray-400">
                Performance
              </p>

              <h2 className="text-lg font-bold text-gray-900">
                Revenue overview
              </h2>

            </div>


            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">

              <TrendingUp className="w-4 h-4" />

              12.5%

            </div>

          </div>


          {/* GRAPH */}

          <div className="h-64 flex items-end gap-4">

            {performanceData.map((item) => {

              const height =
                (item.revenue / maxRevenue) * 100;


              return (

                <div
                  key={item.month}
                  className="flex-1 h-full flex flex-col items-center justify-end gap-2"
                >

                  <div className="relative w-full max-w-[48px] h-full flex items-end">

                    <div
                      className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`RWF ${formatMoney(item.revenue)}`}
                    />

                  </div>


                  <span className="text-xs text-gray-400">
                    {item.month}
                  </span>

                </div>

              );

            })}

          </div>


          {/* SUMMARY */}

          <div className="border-t border-gray-100 mt-5 pt-5 grid grid-cols-2 md:grid-cols-4 gap-4">

            <div>

              <p className="text-xs text-gray-400">
                Revenue
              </p>

              <p className="text-lg font-bold text-gray-900">
                RWF 24.6M
              </p>

            </div>


            <div>

              <p className="text-xs text-gray-400">
                Orders
              </p>

              <p className="text-lg font-bold text-gray-900">
                1,248
              </p>

            </div>


            <div>

              <p className="text-xs text-gray-400">
                Avg. Order
              </p>

              <p className="text-lg font-bold text-gray-900">
                RWF 19.7K
              </p>

            </div>


            <div>

              <p className="text-xs text-gray-400">
                Conversion
              </p>

              <p className="text-lg font-bold text-green-600">
                8.4%
              </p>

            </div>

          </div>

        </div>


        {/* SALES SUMMARY */}

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>

              <p className="text-xs uppercase font-semibold text-gray-400">
                Sales
              </p>

              <h2 className="text-lg font-bold text-gray-900">
                Sales summary
              </h2>

            </div>

            <BarChart3 className="w-5 h-5 text-indigo-500" />

          </div>


          <div className="space-y-6">


            <SummaryRow
              label="Gross Sales"
              value="RWF 28.4M"
              change="+14.2%"
            />


            <SummaryRow
              label="Discounts"
              value="RWF 1.8M"
              change="-3.2%"
              negative
            />


            <SummaryRow
              label="Refunds"
              value="RWF 620K"
              change="-5.4%"
              negative
            />


            <SummaryRow
              label="Net Sales"
              value="RWF 26.0M"
              change="+16.8%"
            />

          </div>


          <div className="mt-6 bg-indigo-50 rounded-xl p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-indigo-600 font-semibold">
                  Average daily revenue
                </p>

                <p className="text-xl font-bold text-indigo-900 mt-1">
                  RWF 820K
                </p>

              </div>


              <DollarSign className="w-6 h-6 text-indigo-500" />

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          CATEGORY PERFORMANCE
      ================================================= */}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-5 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase font-semibold text-gray-400">
              Categories
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              Category performance
            </h2>

          </div>


          <Package className="w-5 h-5 text-indigo-500" />

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-gray-50 border-y border-gray-100">

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                  Category
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                  Products
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                  Units Sold
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                  Revenue
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                  Performance
                </th>

              </tr>

            </thead>


            <tbody>

              {categoryPerformance.map((item) => (

                <tr
                  key={item.category}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >

                  <td className="px-5 py-4">

                    <span className="font-semibold text-sm text-gray-800">
                      {item.category}
                    </span>

                  </td>


                  <td className="px-5 py-4 text-sm text-gray-500">
                    {item.products.toLocaleString()}
                  </td>


                  <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                    {item.sold.toLocaleString()}
                  </td>


                  <td className="px-5 py-4 text-sm font-bold text-gray-900">
                    RWF {formatMoney(item.revenue)}
                  </td>


                  <td className="px-5 py-4 min-w-[180px]">

                    <div className="flex items-center gap-3">

                      <div className="flex-1 h-2 bg-gray-100 rounded-full">

                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />

                      </div>

                      <span className="text-xs font-semibold text-gray-500">
                        {item.percentage}%
                      </span>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          TOP PRODUCTS
      ================================================= */}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-5 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase font-semibold text-gray-400">
              Products
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              Top selling products
            </h2>

          </div>


          <TrendingUp className="w-5 h-5 text-indigo-500" />

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
                  Units Sold
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                  Revenue
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                  Growth
                </th>

              </tr>

            </thead>


            <tbody>

              {topProducts.map((product) => (

                <tr
                  key={product.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

                        <Package className="w-5 h-5" />

                      </div>


                      <div>

                        <p className="text-sm font-bold text-gray-800">
                          {product.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          Product #{product.id}
                        </p>

                      </div>

                    </div>

                  </td>


                  <td className="px-5 py-4 text-sm text-gray-500">
                    {product.category}
                  </td>


                  <td className="px-5 py-4 text-sm font-bold text-gray-800">
                    {product.sold}
                  </td>


                  <td className="px-5 py-4 text-sm font-bold text-gray-900">
                    RWF {formatMoney(product.revenue)}
                  </td>


                  <td className="px-5 py-4">

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">

                      <ArrowUpRight className="w-3 h-3" />

                      {product.growth}%

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          RECENT SALES + AD PERFORMANCE
      ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        {/* RECENT SALES */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          <div className="p-5 flex items-center justify-between">

            <div>

              <p className="text-xs uppercase font-semibold text-gray-400">
                Orders
              </p>

              <h2 className="text-lg font-bold text-gray-900">
                Recent sales
              </h2>

            </div>


            <ShoppingBag className="w-5 h-5 text-indigo-500" />

          </div>


          <div className="divide-y divide-gray-100">

            {recentSales.map((sale) => (

              <div
                key={sale.id}
                className="p-4 flex items-center justify-between gap-4"
              >

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">

                    <ShoppingBag className="w-4 h-4 text-gray-500" />

                  </div>


                  <div>

                    <p className="text-sm font-bold text-gray-800">
                      {sale.product}
                    </p>

                    <p className="text-xs text-gray-400">
                      {sale.customer} · {sale.date}
                    </p>

                  </div>

                </div>


                <div className="text-right">

                  <p className="text-sm font-bold text-gray-900">
                    RWF {formatMoney(sale.amount)}
                  </p>

                  <span
                    className={`text-xs font-semibold ${
                      sale.status === "Completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {sale.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* AD PERFORMANCE */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          <div className="p-5 flex items-center justify-between">

            <div>

              <p className="text-xs uppercase font-semibold text-gray-400">
                Advertising
              </p>

              <h2 className="text-lg font-bold text-gray-900">
                Advertisement performance
              </h2>

            </div>


            <Megaphone className="w-5 h-5 text-indigo-500" />

          </div>


          <div className="divide-y divide-gray-100">

            {adPerformance.map((ad) => (

              <div
                key={ad.name}
                className="p-4"
              >

                <div className="flex items-center justify-between mb-3">

                  <p className="text-sm font-bold text-gray-800">
                    {ad.name}
                  </p>

                  <span className="text-xs font-bold text-green-600">
                    {ad.ctr} CTR
                  </span>

                </div>


                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-gray-50 rounded-xl p-3">

                    <div className="flex items-center gap-2">

                      <Eye className="w-4 h-4 text-gray-400" />

                      <span className="text-xs text-gray-500">
                        Impressions
                      </span>

                    </div>

                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {ad.impressions}
                    </p>

                  </div>


                  <div className="bg-gray-50 rounded-xl p-3">

                    <div className="flex items-center gap-2">

                      <TrendingUp className="w-4 h-4 text-gray-400" />

                      <span className="text-xs text-gray-500">
                        Clicks
                      </span>

                    </div>

                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {ad.clicks}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// ANALYTICS CARD
// =====================================================

function AnalyticsCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  positive,
}) {

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

          <Icon className="w-5 h-5" />

        </div>


        <span
          className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
            positive
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >

          {positive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}

          {change}

        </span>

      </div>


      <p className="text-sm text-gray-500 mt-5">
        {title}
      </p>


      <p className="text-2xl font-bold text-gray-900 mt-1">
        {value}
      </p>


      <p className="text-xs text-gray-400 mt-1">
        {description}
      </p>

    </div>
  );
}


// =====================================================
// SUMMARY ROW
// =====================================================

function SummaryRow({
  label,
  value,
  change,
  negative = false,
}) {

  return (
    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm font-medium text-gray-600">
          {label}
        </p>

        <p className="text-lg font-bold text-gray-900 mt-1">
          {value}
        </p>

      </div>


      <span
        className={`flex items-center gap-1 text-xs font-bold ${
          negative
            ? "text-red-600"
            : "text-green-600"
        }`}
      >

        {negative ? (
          <ArrowDownRight className="w-3 h-3" />
        ) : (
          <ArrowUpRight className="w-3 h-3" />
        )}

        {change}

      </span>

    </div>
  );
}
