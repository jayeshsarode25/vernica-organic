import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  updateOrderStatus,
  clearOrderError,
} from "../../redux/reducer/orderSlice";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Loader,
} from "lucide-react";

const Orders = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { allOrders = [], loading, actionLoading, error, pagination } = useSelector(
    (state) => state.order || {}
  );

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusModal, setStatusModal] = useState({
    open: false,
    orderId: null,
    status: "",
  });

  // ✅ FETCH ORDERS ON MOUNT - THIS WAS MISSING!
  useEffect(() => {
    console.log("Orders component mounted, fetching orders...");
    dispatch(getAllOrders());
  }, [dispatch]);

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!statusModal.orderId || !statusModal.status) return;

    try {
      await dispatch(
        updateOrderStatus({
          orderId: statusModal.orderId,
          status: statusModal.status,
        })
      ).unwrap();
      
      setStatusModal({ open: false, orderId: null, status: "" });
      
      // Refresh orders list
      setTimeout(() => {
        dispatch(getAllOrders());
      }, 500);
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    if (!allOrders || allOrders.length === 0) {
      alert("No orders to export");
      return;
    }

    const csv = [
      [
        "Order ID",
        "Customer Name",
        "Email",
        "Phone",
        "Status",
        "Total",
        "Date",
      ].join(","),
      ...allOrders.map((o) =>
        [
          o._id || "N/A",
          o.user?.name || "N/A",
          o.user?.email || "N/A",
          o.user?.phone || "N/A",
          o.status || "N/A",
          o.totalPrice?.amount || 0,
          new Date(o.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Debug: Log state
  useEffect(() => {
    console.log("Orders state:", { allOrders, loading, error, pagination });
  }, [allOrders, loading, error, pagination]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">
          Manage and track all customer orders
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="text-red-900 font-semibold text-sm">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => dispatch(clearOrderError())}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2.5 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg font-medium transition-colors border border-blue-200"
          >
            <Filter size={18} /> Filters
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors border border-gray-200"
          >
            <Download size={18} /> Export
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full bg-gray-50 text-gray-900 rounded-lg px-3 py-2.5 border border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full bg-gray-50 text-gray-900 rounded-lg px-3 py-2.5 border border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full bg-gray-50 text-gray-900 rounded-lg px-3 py-2.5 border border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({
                    status: "",
                    search: "",
                    startDate: "",
                    endDate: "",
                  });
                  setShowFilters(false);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
            <p className="text-gray-600 font-medium">Loading orders...</p>
          </div>
        ) : !allOrders || allOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No orders found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-blue-600 font-medium">
                          {order._id ? order._id.slice(-8) : "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium text-sm">
                        {order.user?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {order.user?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold text-sm">
                        ₹{(order.totalPrice?.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetailModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setStatusModal({
                                open: true,
                                orderId: order._id,
                                status: order.status,
                              });
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
                            title="Update status"
                          >
                            <Edit2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (pagination.page > 1) {
                        dispatch(getAllOrders());
                      }
                    }}
                    disabled={pagination.page === 1}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (pagination.page < pagination.totalPages) {
                        dispatch(getAllOrders());
                      }
                    }}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={(status) => {
            setStatusModal({
              open: true,
              orderId: selectedOrder._id,
              status,
            });
          }}
        />
      )}

      {/* Status Update Modal */}
      {statusModal.open && (
        <StatusUpdateModal
          orderId={statusModal.orderId}
          currentStatus={statusModal.status}
          onStatusChange={(status) => {
            setStatusModal({ ...statusModal, status });
          }}
          onConfirm={handleUpdateStatus}
          onClose={() =>
            setStatusModal({ open: false, orderId: null, status: "" })
          }
          loading={actionLoading}
        />
      )}
    </div>
  );
};

// ========== STATUS BADGE ==========
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
    PROCESSING: "bg-blue-50 text-blue-700 border border-blue-200",
    SHIPPED: "bg-purple-50 text-purple-700 border border-purple-200",
    DELIVERED: "bg-green-50 text-green-700 border border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || styles.PENDING
      }`}
    >
      {status || "PENDING"}
    </span>
  );
};

// ========== ORDER DETAIL MODAL ==========
const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Order ID
                </p>
                <p className="text-lg font-mono font-semibold text-gray-900">
                  {order._id}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Customer
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-900 font-medium">
                  {order.user?.name}
                </p>
                <p className="text-sm text-gray-600">{order.user?.email}</p>
                <p className="text-sm text-gray-600">{order.user?.phone}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Pricing
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900 font-medium">
                    ${(order.totalPrice?.amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900 font-medium">
                    ${(order.shippingPrice?.amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-blue-600">
                    ${(
                      (order.totalPrice?.amount || 0) +
                      (order.shippingPrice?.amount || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Shipping Address
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 border border-gray-200">
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.item && order.item.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                Items
              </p>
              <div className="space-y-2">
                {order.item.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.product}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ${(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6 flex gap-3">
            <button
              onClick={() => onStatusChange(order.status)}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg font-medium transition-colors border border-blue-200"
            >
              Update Status
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors border border-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== STATUS UPDATE MODAL ==========
const StatusUpdateModal = ({
  orderId,
  currentStatus,
  onStatusChange,
  onConfirm,
  onClose,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Update Order Status
        </h2>

        <select
          value={currentStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full bg-gray-50 text-gray-900 rounded-lg px-4 py-2.5 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-6 font-medium"
        >
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;  