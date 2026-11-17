import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  PhoneCall,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../lib/utils';
import { PAKISTANI_CITIES } from '../../lib/pakistaniCities';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('TCS Luxury Express');
  const [statusComment, setStatusComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.set('status', statusFilter);
      if (cityFilter !== 'all') query.set('city', cityFilter);
      if (search.trim()) query.set('search', search.trim());

      const res = await api.get(`/orders/admin?${query.toString()}`);
      if (res?.orders) {
        setOrders(res.orders);
        setTotalCount(res.totalCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, cityFilter]);

  const openOrderModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setNewPaymentStatus(ord.paymentStatus);
    setTrackingNumber(ord.trackingNumber || '');
    setCourierName(ord.courierName || 'TCS Luxury Express');
    setStatusComment('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      setIsUpdating(true);
      const res = await api.put(`/orders/${selectedOrder._id}/status`, {
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus,
        trackingNumber,
        courierName,
        comment: statusComment,
      });

      if (res?.order) {
        setSelectedOrder(res.order);
        setOrders(orders.map((o) => (o._id === res.order._id ? res.order : o)));
      }
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-rose-deep font-semibold">
            Order Fulfillment Concierge
          </span>
          <h1 className="font-serif text-3xl font-medium text-charcoal-900">
            Client Orders ({totalCount})
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-charcoal-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-5 relative">
          <Search className="h-4 w-4 text-charcoal-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
            placeholder="Search order number, phone, recipient name..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-charcoal-200 rounded-sm focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-xs py-2 px-3 border border-charcoal-200 rounded-sm bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full text-xs py-2 px-3 border border-charcoal-200 rounded-sm bg-white focus:outline-none"
          >
            <option value="all">All Pakistani Cities</option>
            {PAKISTANI_CITIES.slice(0, 15).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
          <Button size="sm" onClick={loadOrders} className="w-full">
            Go
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm border border-charcoal-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-ivory-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-charcoal-900">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-charcoal-900 font-medium block">
                      {ord.shippingAddress?.recipientName}
                    </strong>
                    <span className="text-[10px] text-charcoal-500 font-mono">
                      {ord.shippingAddress?.phone}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {ord.shippingAddress?.city}
                  </td>
                  <td className="py-3 px-4">
                    {ord.items?.length || 0} pieces
                  </td>
                  <td className="py-3 px-4 font-bold text-charcoal-900">
                    {formatPrice(ord.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="block text-[11px] font-medium">{ord.paymentMethod}</span>
                    <span className={`text-[10px] ${ord.paymentStatus === 'Paid' ? 'text-emerald-700 font-semibold' : 'text-charcoal-400'}`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        ord.orderStatus === 'Delivered'
                          ? 'success'
                          : ord.orderStatus === 'Confirmed'
                          ? 'gold'
                          : ord.orderStatus === 'Pending'
                          ? 'rose'
                          : 'outline'
                      }
                    >
                      {ord.orderStatus}
                    </Badge>
                    {ord.isCodFlaggedForConfirmation && ord.orderStatus === 'Pending' && (
                      <span className="text-[9px] text-rose-deep font-semibold block mt-0.5">
                        📞 Call Verification Required
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openOrderModal(ord)}
                      className="px-2.5 py-1 rounded bg-charcoal-900 text-ivory-50 text-[10px] uppercase tracking-wider font-semibold hover:bg-charcoal-700"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Manager Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Management: ${selectedOrder.orderNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Delivery & Client details */}
            <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-ivory-50 rounded-sm border border-charcoal-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Recipient</span>
                <p className="font-semibold text-charcoal-900">{selectedOrder.shippingAddress.recipientName}</p>
                <p className="font-mono">{selectedOrder.shippingAddress.phone}</p>
                <p className="text-charcoal-500">{selectedOrder.shippingAddress.email || selectedOrder.guestInfo?.email}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Delivery Address</span>
                <p>{selectedOrder.shippingAddress.streetAddress}</p>
                <p>{selectedOrder.shippingAddress.apartment}</p>
                <p><strong>{selectedOrder.shippingAddress.city}</strong>, Pakistan</p>
              </div>
            </div>

            {/* Items */}
            <div className="border border-charcoal-100 rounded-sm divide-y divide-charcoal-100">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.title} className="w-10 h-14 object-cover rounded" />
                    <div>
                      <strong className="text-charcoal-900">{item.title}</strong>
                      <p className="text-[11px] text-charcoal-500">
                        {item.variant.size} · {item.variant.color} · Qty: {item.qty}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-charcoal-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                    Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full text-xs h-10 px-3 border border-charcoal-200 rounded-sm bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed (Phone Verified)</option>
                    <option value="Packed">Packed in Discreet Box</option>
                    <option value="Shipped">Shipped via Courier</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full text-xs h-10 px-3 border border-charcoal-200 rounded-sm bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <Input
                    label="Courier Name"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="TCS Express / Trax / Call Courier"
                  />
                </div>

                <div>
                  <Input
                    label="Courier Tracking Number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. TCS-99824102"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Internal Atelier Note / Customer Comment"
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="e.g. Verified telephone address with client Sara Farooq."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <Button type="button" variant="ghost" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
                <Button type="submit" isLoading={isUpdating}>
                  Update Status & Tracking
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
