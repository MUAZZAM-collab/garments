import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  Package,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="text-xs text-charcoal-500 py-10">Loading atelier metrics...</div>;
  }

  const stats = data?.stats || {
    totalRevenue: 2850000,
    totalOrders: 142,
    totalCustomers: 89,
    totalProducts: 12,
    pendingCodOrders: 4,
  };

  const chartData = data?.chartData || [];
  const cityData = data?.cityBreakdown || [];
  const lowStockAlerts = data?.lowStockAlerts || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-rose-deep font-semibold">
            Atelier Executive Control
          </span>
          <h1 className="font-serif text-3xl font-medium text-charcoal-900">
            Performance Overview
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/orders"
            className="px-3.5 py-2 bg-charcoal-900 text-ivory-50 rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-charcoal-700 transition-colors shadow-sm"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-sm border border-charcoal-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-500 uppercase tracking-wider">
            <span>Total Gross Revenue</span>
            <div className="p-2 bg-emerald-50 rounded-sm text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {formatPrice(stats.totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">+18.4% from last month</span>
        </div>

        {/* Orders */}
        <div className="bg-white p-5 rounded-sm border border-charcoal-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-500 uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="p-2 bg-ivory-100 rounded-sm text-charcoal-700">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {stats.totalOrders}
          </div>
          <span className="text-[11px] text-charcoal-500">
            {stats.pendingCodOrders} COD orders awaiting call verification
          </span>
        </div>

        {/* Customers */}
        <div className="bg-white p-5 rounded-sm border border-charcoal-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-500 uppercase tracking-wider">
            <span>Registered Patrons</span>
            <div className="p-2 bg-rose-light rounded-sm text-rose-deep">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {stats.totalCustomers}
          </div>
          <span className="text-[11px] text-gold-dark font-medium">Rose Gold & Black Card VIPs</span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-sm border border-charcoal-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-500 uppercase tracking-wider">
            <span>Low Stock Variants</span>
            <div className="p-2 bg-amber-50 rounded-sm text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {lowStockAlerts.length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Stock ≤ 3 items remaining</span>
        </div>
      </div>

      {/* Revenue & City Distribution Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-sm border border-charcoal-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Monthly Revenue Trend (PKR)
              </h3>
              <p className="text-[11px] text-charcoal-400">Net order volume over recent six months</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B3F4C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7B3F4C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe6" />
                <XAxis dataKey="month" stroke="#9C958E" fontSize={11} />
                <YAxis
                  stroke="#9C958E"
                  fontSize={11}
                  tickFormatter={(val) => `PKR ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val) => [formatPrice(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#1C1A19', color: '#F7F2EE', borderRadius: 4, fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7B3F4C"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City Breakdown Bar Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-sm border border-charcoal-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-serif text-lg font-medium text-charcoal-900">
              Orders by Pakistani City
            </h3>
            <p className="text-[11px] text-charcoal-400">Top metropolitan destinations</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe6" />
                <XAxis dataKey="city" stroke="#9C958E" fontSize={10} />
                <YAxis stroke="#9C958E" fontSize={10} />
                <Tooltip
                  formatter={(val) => [val, 'Orders']}
                  contentStyle={{ backgroundColor: '#1C1A19', color: '#F7F2EE', borderRadius: 4, fontSize: 12 }}
                />
                <Bar dataKey="orders" fill="#C9A961" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Section: Low Stock Variant Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-sm border border-charcoal-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Low Stock Variant Warnings
              </h3>
            </div>
            <Link to="/admin/products" className="text-xs text-rose-deep hover:underline">
              View All Products →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
                <tr>
                  <th className="py-2 px-3">Product</th>
                  <th className="py-2 px-3">Variant (Size · Color)</th>
                  <th className="py-2 px-3">Stock</th>
                  <th className="py-2 px-3">SKU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
                {lowStockAlerts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-charcoal-400">
                      All product inventory levels are healthy.
                    </td>
                  </tr>
                ) : (
                  lowStockAlerts.map((alert, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 font-medium truncate max-w-[150px]">
                        {alert.productTitle}
                      </td>
                      <td className="py-2.5 px-3">
                        {alert.size} · {alert.color}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {alert.stock} left
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-charcoal-500">
                        {alert.sku}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-sm border border-charcoal-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-medium text-charcoal-900">
              Recent Orders Placed
            </h3>
            <Link to="/admin/orders" className="text-xs text-rose-deep hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
                <tr>
                  <th className="py-2 px-3">Order #</th>
                  <th className="py-2 px-3">Recipient</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
                {recentOrders.map((ord) => (
                  <tr key={ord._id}>
                    <td className="py-2.5 px-3 font-mono font-semibold">
                      {ord.orderNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      {ord.shippingAddress?.recipientName} ({ord.shippingAddress?.city})
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          ord.orderStatus === 'Delivered'
                            ? 'success'
                            : ord.orderStatus === 'Confirmed'
                            ? 'gold'
                            : 'outline'
                        }
                      >
                        {ord.orderStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
