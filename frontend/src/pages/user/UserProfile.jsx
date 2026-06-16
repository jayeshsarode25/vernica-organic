"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  addAddress,
  deleteAddress,
  logoutUser,
  clearToast,
} from "../../redux/reducer/Profileslice";
import { getMyOrders } from "../../redux/reducer/orderSlice";

const STATUS = {
  DELIVERED:  { pill: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-400" },
  SHIPPED:    { pill: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-400" },
  CANCELLED:  { pill: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-400" },
  PENDING:    { pill: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400" },
  PROCESSING: { pill: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-400" },
  CONFIRMED:  { pill: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-400" },
};

const formatMoney = (value, currency = "INR") => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Rs. -";
  const prefix = currency === "USD" ? "USD" : "Rs.";
  return `${prefix} ${amount.toLocaleString("en-IN")}`;
};

const getOrderTotal = (order) =>
  order.totalPrice?.amount ?? order.totalAmount ?? order.total ?? 0;

const getOrderCurrency = (order) =>
  order.totalPrice?.currency ?? order.currency ?? "INR";

const getOrderItemName = (item) =>
  item.product?.title ??
  item.productId?.title ??
  item.productName ??
  item.title ??
  "Product";

const getOrderItemPrice = (item) =>
  item.price?.amount ??
  item.totalPrice?.amount ??
  item.product?.price?.amount ??
  item.productId?.price?.amount ??
  0;

const getOrderItemCurrency = (item) =>
  item.price?.currency ??
  item.totalPrice?.currency ??
  item.product?.price?.currency ??
  item.productId?.price?.currency ??
  "INR";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((s) => s.profile.toast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(clearToast()), 3000);
    return () => clearTimeout(t);
  }, [toast, dispatch]);
  if (!toast) return null;
  const bg   = { success: "bg-green-500", error: "bg-red-500", info: "bg-gray-700" };
  const icon = { success: "✓", error: "✕", info: "→" };
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-semibold shadow-xl animate-pop-in ${bg[toast.type] ?? bg.info}`}>
      <span>{icon[toast.type]}</span> {toast.msg}
    </div>
  );
}

// ─── Add Address Form ─────────────────────────────────────────────────────────
function AddAddressForm({ onCancel }) {
  const dispatch = useDispatch();
  const adding = useSelector((s) => s.profile.addingAddress);
  const [form, setForm] = useState({
    street: "", city: "", state: "", pincode: "", country: "India", isDefault: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.street.trim())            e.street  = "Required";
    if (!form.city.trim())              e.city    = "Required";
    if (!form.state.trim())             e.state   = "Required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "6-digit pincode";
    if (!form.country.trim())           e.country = "Required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const result = await dispatch(addAddress(form));
    if (!result.error) onCancel();
  };

  const fields = [
    { name: "street",  label: "Street",  placeholder: "12, MG Road, Flat 3B", full: true },
    { name: "city",    label: "City",    placeholder: "Mumbai" },
    { name: "state",   label: "State",   placeholder: "Maharashtra" },
    { name: "pincode", label: "Pincode", placeholder: "400001", maxLength: 6 },
    { name: "country", label: "Country", placeholder: "India" },
  ];

  return (
    <div className="mt-4 p-5 border border-dashed border-gray-300 rounded-2xl bg-gray-50 animate-pop-in">
      <h3 className="text-sm font-bold text-gray-800 mb-4">New Address</h3>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? "col-span-2" : "col-span-1"}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              {f.label}
            </label>
            <input
              name={f.name} value={form[f.name]} onChange={handleChange}
              placeholder={f.placeholder} maxLength={f.maxLength}
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 transition-all
                focus:outline-none focus:ring-2 focus:ring-green-300/40 focus:border-green-400
                ${errors[f.name] ? "border-red-400" : "border-gray-200"}`}
            />
            {errors[f.name] && (
              <span className="text-xs text-red-500 mt-1 block">{errors[f.name]}</span>
            )}
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2.5 mt-3 cursor-pointer">
        <input
          type="checkbox" name="isDefault" checked={form.isDefault}
          onChange={handleChange} className="w-4 h-4 accent-green-400 cursor-pointer"
        />
        <span className="text-xs text-gray-500">Set as default address</span>
      </label>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave} disabled={adding}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60 rounded-xl transition-colors"
        >
          {adding
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </span>
            : "Save Address"}
        </button>
      </div>
    </div>
  );
}

// ─── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({ addr }) {
  const dispatch   = useDispatch();
  const deletingId = useSelector((s) => s.profile.deletingAddressId);
  const isDeleting = deletingId === addr._id;

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all animate-pop-in">
      {addr.isDefault && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-md px-2 py-0.5 mb-3">
          ★ Default
        </span>
      )}
      <p className="text-sm font-semibold text-gray-900 mb-1">{addr.street}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{addr.city}, {addr.state} — {addr.pincode}</p>
      <p className="text-xs text-gray-400">{addr.country}</p>
      <button
        onClick={() => { if (window.confirm("Remove this address?")) dispatch(deleteAddress(addr._id)); }}
        disabled={isDeleting}
        className="mt-4 text-xs font-semibold text-red-400 hover:text-red-500 disabled:opacity-50 transition-colors"
      >
        {isDeleting ? "Removing…" : "✕ Remove"}
      </button>
    </div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({ order }) {
  const status = String(order.status ?? "PENDING").toUpperCase();
  const s = STATUS[status] ?? STATUS.PENDING;

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "-";

  const orderItems = Array.isArray(order.items) ? order.items : [];
  const itemCount = orderItems.length;
  const total = getOrderTotal(order);
  const currency = getOrderCurrency(order);

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-sm font-semibold text-gray-900 tracking-wide">
            #{order._id?.slice(-6).toUpperCase()}
          </span>
          <span className="text-xs text-gray-400">
            {date} - {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-bold text-green-500">
            {formatMoney(total, currency)}
          </span>
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{status}
          </span>
        </div>
      </div>

      {orderItems.length > 0 && (
        <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100 pt-2">
          {orderItems.map((item, index) => (
            <div
              key={item._id ?? item.productId?._id ?? index}
              className="flex items-center justify-between gap-4 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {getOrderItemName(item)}
                </p>
                <p className="text-xs text-gray-400">
                  Qty: {item.quantity ?? item.qty ?? 1}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-gray-900">
                {formatMoney(getOrderItemPrice(item), getOrderItemCurrency(item))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserProfile() {
  const dispatch = useDispatch();

  const { addresses, addressesLoading, loggingOut } = useSelector((s) => s.profile);
  const user          = useSelector((s) => s.auth.user);
  const myOrders      = useSelector((s) => s.order.myOrders);
  const ordersLoading = useSelector((s) => s.order.loading);

  // ✅ Name only — never phone as display name
  const displayName = user?.name || user?.username || user?.fullName || user?.displayName || "User";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showOrders, setShowOrders]   = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(getMyOrders());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setTimeout(() => { window.location.href = "/login"; }, 1200);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <Toast />
      <div className="max-w-3xl mx-auto flex flex-col gap-5">

        {/* ── Hero ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-5 bg-white border border-gray-200 rounded-2xl px-8 py-6 shadow-sm">
          {/* Avatar — neutral dark, initials in white */}
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-black shadow-sm">
              {initials}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* ✅ Name only */}
            <h1 className="text-xl font-black text-gray-900 tracking-tight">{displayName}</h1>
            {/* ✅ mint green on the email/phone as a subtle highlight */}
            <p className="text-sm text-green-500 mt-0.5 font-medium">
              {user?.email ?? user?.phone}
            </p>
          </div>

          <button
            onClick={handleLogout} disabled={loggingOut}
            className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-all"
          >
            {loggingOut ? "…" : "⏻"} {loggingOut ? "Logging out" : "Logout"}
          </button>
        </div>

        {/* ── Addresses ──────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl px-8 py-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">Saved Addresses</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {addresses.length} address{addresses.length !== 1 ? "es" : ""} on file
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-900 bg-white border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
              >
                + Add Address
              </button>
            )}
          </div>

          {addressesLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
              <span className="w-4 h-4 border-2 border-gray-200 border-t-green-400 rounded-full animate-spin" />
              Loading addresses…
            </div>
          ) : addresses.length === 0 && !showAddForm ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <span className="text-3xl">📍</span>
              <p className="text-sm font-medium text-gray-600">No addresses saved yet</p>
              <p className="text-xs text-gray-400">Add one to speed up checkout</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => <AddressCard key={addr._id} addr={addr} />)}
            </div>
          )}

          {showAddForm && <AddAddressForm onCancel={() => setShowAddForm(false)} />}
        </div>

        {/* ── Orders ─────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl px-8 py-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">My Orders</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {myOrders.length} order{myOrders.length !== 1 ? "s" : ""} placed
              </p>
            </div>
            <button
              onClick={() => setShowOrders((p) => !p)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors flex items-center gap-2"
            >
              {showOrders ? "Hide" : "Show"} Orders
              <span className="text-xs opacity-40">{showOrders ? "▲" : "▼"}</span>
            </button>
          </div>

          {showOrders && (
            <div className="flex flex-col gap-2 mt-5">
              {ordersLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
                  <span className="w-4 h-4 border-2 border-gray-200 border-t-green-400 rounded-full animate-spin" />
                  Loading orders…
                </div>
              ) : myOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <span className="text-3xl">🛍️</span>
                  <p className="text-sm font-medium text-gray-600">No orders yet</p>
                  <p className="text-xs text-gray-400">Your orders will appear here once placed</p>
                </div>
              ) : (
                myOrders.map((order) => <OrderRow key={order._id} order={order} />)
              )}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes pop-in {
          from { opacity:0; transform:scale(0.97) translateY(6px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .animate-pop-in { animation: pop-in .25s ease both; }
      `}</style>
    </div>
  );
}
