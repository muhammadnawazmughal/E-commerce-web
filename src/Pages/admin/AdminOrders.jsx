import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Eye,
  CheckCircle,
  Truck,
  RotateCcw,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 50
      });
      setOrders(res.data || []);
    } catch (err) {
      showToast('Failed to load orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Status transition rejected.', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getNextAvailableStatuses = (currentStatus) => {
    const transitions = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Processing', 'Cancelled'],
      Processing: ['Shipped', 'Cancelled'],
      Shipped: ['Delivered'],
      Delivered: [],
      Cancelled: []
    };
    return transitions[currentStatus] || [];
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Operations & Fulfillment
          </span>
          <h1 className="font-serif text-3xl font-bold text-noir-900 mt-1">
            Orders Management ({orders.length})
          </h1>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-luxury-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-luxury-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-noir-900 focus:outline-none focus:border-gold"
          >
            <option value="all">All Lifecycles</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-luxury-200 shadow-sm overflow-hidden p-6">
        {loading ? (
          <LoadingSpinner text="Querying fulfillment pipeline..." />
        ) : orders.length === 0 ? (
          <p className="text-center py-12 text-xs text-luxury-500 italic">
            No orders found matching filter criteria.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-luxury-200 bg-[#FAF8F5] text-luxury-700 uppercase tracking-wider font-semibold">
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5">Status Action</th>
                  <th className="p-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-100 text-luxury-800">
                {orders.map((order) => {
                  const nextStatuses = getNextAvailableStatuses(order.orderStatus);
                  return (
                    <tr key={order._id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-noir-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-noir-900">{order.userId?.name || 'Customer'}</p>
                        <p className="text-[11px] text-luxury-500">{order.userId?.email || 'N/A'}</p>
                      </td>
                      <td className="p-3.5 text-luxury-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 font-serif font-bold text-noir-900 text-sm">
                        ${order.total?.toFixed(2)}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                          {order.paymentStatus} ({order.paymentMethod})
                        </span>
                      </td>
                      <td className="p-3.5">
                        <Badge variant={order.orderStatus}>{order.orderStatus}</Badge>
                      </td>
                      <td className="p-3.5">
                        {nextStatuses.length > 0 ? (
                          <div className="flex gap-1.5">
                            {nextStatuses.map((st) => (
                              <button
                                key={st}
                                disabled={isUpdatingStatus}
                                onClick={() => handleUpdateStatus(order._id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                  st === 'Cancelled'
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                    : 'bg-noir-900 text-gold hover:bg-gold hover:text-noir-900'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-luxury-400 italic">Finalized</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailsModalOpen(true);
                          }}
                          className="p-1.5 text-luxury-600 hover:text-noir-900 hover:bg-luxury-100 rounded-lg transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Inspection Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={`Order #${selectedOrder._id.slice(-8).toUpperCase()} Details`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs text-luxury-800">
            <div className="flex justify-between items-center pb-3 border-b border-luxury-200">
              <div>
                <p className="font-bold text-noir-900">Client: {selectedOrder.userId?.name}</p>
                <p className="text-luxury-500">{selectedOrder.userId?.email}</p>
              </div>
              <Badge variant={selectedOrder.orderStatus}>{selectedOrder.orderStatus}</Badge>
            </div>

            {/* Line items */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-luxury-700">Line Items</h4>
              <div className="divide-y divide-luxury-100 bg-white p-4 rounded-xl border border-luxury-200">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-luxury-50"
                      />
                      <div>
                        <p className="font-bold text-noir-900">{item.name}</p>
                        <p className="text-luxury-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-noir-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-luxury-200">
              <div>
                <p className="font-bold text-noir-900 mb-1">Destination Address:</p>
                <p>{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.street}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                <p>{selectedOrder.shippingAddress?.country}</p>
                <p className="pt-1 text-luxury-500">Tel: {selectedOrder.shippingAddress?.phone}</p>
              </div>
              <div>
                <p className="font-bold text-noir-900 mb-1">Billing Breakdown:</p>
                <p>Subtotal: ${selectedOrder.subtotal?.toFixed(2)}</p>
                <p>Shipping: ${selectedOrder.shippingCost?.toFixed(2)}</p>
                <p className="font-bold text-noir-900 text-sm pt-2">
                  Total: ${selectedOrder.total?.toFixed(2)}
                </p>
                <p className="pt-1 text-emerald-700 font-semibold">Payment: {selectedOrder.paymentStatus} via {selectedOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Quick Status Transition from inside modal */}
            {getNextAvailableStatuses(selectedOrder.orderStatus).length > 0 && (
              <div className="pt-3 border-t border-luxury-200 flex items-center justify-between">
                <span className="font-bold text-noir-900">Transition Status:</span>
                <div className="flex gap-2">
                  {getNextAvailableStatuses(selectedOrder.orderStatus).map((st) => (
                    <button
                      key={st}
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(selectedOrder._id, st)}
                      className="px-4 py-1.5 rounded-lg bg-noir-900 text-gold hover:bg-gold hover:text-noir-900 font-bold uppercase tracking-wider text-[11px] transition-colors"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};

export default AdminOrders;
