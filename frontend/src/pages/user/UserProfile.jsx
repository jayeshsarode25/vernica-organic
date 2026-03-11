"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  addAddress,
  deleteAddress,
  logoutUser,
  clearToast,
} from "../../redux/reducer/Profileslice"; // adjust path

// ─── Mock Orders — replace with real thunk when API is ready ─────────────────
const MOCK_ORDERS = [
  { id: "#ORD-8821", date: "Mar 05, 2026", status: "Delivered", total: "₹10,399", items: 3 },
  { id: "#ORD-8754", date: "Feb 20, 2026", status: "Shipped",   total: "₹7,450",  items: 2 },
  { id: "#ORD-8701", date: "Feb 10, 2026", status: "Delivered", total: "₹17,600", items: 5 },
  { id: "#ORD-8633", date: "Jan 28, 2026", status: "Cancelled", total: "₹3,750",  items: 1 },
  { id: "#ORD-8590", date: "Jan 14, 2026", status: "Delivered", total: "₹27,530", items: 4 },
];

const STATUS = {
  Delivered: { pill: "bg-emerald-900/40 text-emerald-400", dot: "bg-emerald-400" },
  Shipped:   { pill: "bg-blue-900/40 text-blue-400",       dot: "bg-blue-400"   },
  Cancelled: { pill: "bg-red-900/40 text-red-400",         dot: "bg-red-400"    },
  Pending:   { pill: "bg-amber-900/40 text-amber-400",     dot: "bg-amber-400"  },
};

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((s) => s.profile.toast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(clearToast()), 3000);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;

  const bg = { success: "bg-emerald-600", error: "bg-red-600", info: "bg-blue-600" };
  const icon = { success: "✓", error: "✕", info: "→" };

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-semibold shadow-2xl animate-pop-in ${bg[toast.type] ?? bg.info}`}>
      <span>{icon[toast.type]}</span> {toast.msg}
    </div>
  );
}

// ─── Add Address Form (inline) ────────────────────────────────────────────────
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
    <div className="mt-4 p-5 border border-dashed border-slate-600 rounded-2xl bg-slate-800/40 animate-pop-in">
      <h3 className="text-sm font-bold text-slate-200 mb-4">New Address</h3>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? "col-span-2" : "col-span-1"}>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {f.label}
            </label>
            <input
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              maxLength={f.maxLength}
              className={`w-full bg-slate-900 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500
                ${errors[f.name] ? "border-red-500" : "border-slate-700"}`}
            />
            {errors[f.name] && (
              <span className="text-xs text-red-400 mt-1 block">{errors[f.name]}</span>
            )}
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2.5 mt-3 cursor-pointer">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
          className="w-4 h-4 accent-orange-500 cursor-pointer"
        />
        <span className="text-xs text-slate-400">Set as default address</span>
      </label>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 text-sm font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={adding}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 rounded-xl transition-colors"
        >
          {adding ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving…
            </span>
          ) : "Save Address"}
        </button>
      </div>
    </div>
  );
}

// ─── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({ addr }) {
  const dispatch    = useDispatch();
  const deletingId  = useSelector((s) => s.profile.deletingAddressId);
  const isDeleting  = deletingId === addr._id;

  const handleDelete = () => {
    if (!window.confirm("Remove this address?")) return;
    dispatch(deleteAddress(addr._id));
  };

  return (
    <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-5 hover:border-slate-500 transition-colors group animate-pop-in">
      {addr.isDefault && (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-md px-2 py-0.5 mb-3">
          ★ Default
        </span>
      )}
      <p className="text-sm font-semibold text-slate-100 mb-1">{addr.street}</p>
      <p className="text-xs text-slate-400 leading-relaxed">
        {addr.city}, {addr.state} — {addr.pincode}
      </p>
      <p className="text-xs text-slate-500">{addr.country}</p>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="mt-4 text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
      >
        {isDeleting ? "Removing…" : "✕ Remove"}
      </button>
    </div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({ order }) {
  const s = STATUS[order.status] ?? STATUS.Pending;
  return (
    <div className="flex items-center justify-between gap-4 bg-slate-800/40 border border-slate-700/60 rounded-xl px-5 py-4 hover:border-slate-600 transition-colors">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-sm font-semibold text-slate-100 tracking-wide">
          {order.id}
        </span>
        <span className="text-xs text-slate-500">
          {order.date} · {order.items} item{order.items > 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-sm font-bold text-orange-400">{order.total}</span>
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {order.status}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserProfile() {
  const dispatch = useDispatch();
  const { addresses, addressesLoading, loggingOut } = useSelector((s) => s.profile);

  // Swap with your real user selector if available
  const user = useSelector((s) => s.auth?.user) ?? { name: "Alex Johnson", email: "alex@example.com" };
  const initials = user.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  const [showAddForm, setShowAddForm]   = useState(false);
  const [showOrders, setShowOrders]     = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setTimeout(() => { window.location.href = "/login"; }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <Toast />

      <div className="max-w-3xl mx-auto flex flex-col gap-5">

        {/* ── Hero ─────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-5 bg-slate-900 border border-slate-800 rounded-2xl px-8 py-6 shadow-xl">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 blur-md opacity-40" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-xl font-black shadow-lg">
              {initials}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-slate-100 tracking-tight">{user.name}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-400 border border-red-500/40 hover:bg-red-500/10 hover:border-red-400 disabled:opacity-50 transition-all"
          >
            {loggingOut ? "…" : "⏻"} {loggingOut ? "Logging out" : "Logout"}
          </button>
        </div>

        {/* ── Addresses ────────────────────────────────── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-8 py-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-100">Saved Addresses</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {addresses.length} address{addresses.length !== 1 ? "es" : ""} on file
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                + Add Address
              </button>
            )}
          </div>

          {addressesLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-8 justify-center">
              <span className="w-4 h-4 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
              Loading addresses…
            </div>
          ) : addresses.length === 0 && !showAddForm ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-500">
              <span className="text-3xl">📍</span>
              <p className="text-sm font-medium">No addresses saved yet</p>
              <p className="text-xs text-slate-600">Add one to speed up checkout</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => (
                <AddressCard key={addr._id} addr={addr} />
              ))}
            </div>
          )}

          {/* Inline add form */}
          {showAddForm && (
            <AddAddressForm onCancel={() => setShowAddForm(false)} />
          )}
        </div>

        {/* ── Orders ───────────────────────────────────── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-8 py-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-100">My Orders</h2>
              <p className="text-xs text-slate-500 mt-0.5">{MOCK_ORDERS.length} orders placed</p>
            </div>
            <button
              onClick={() => setShowOrders((p) => !p)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              {showOrders ? "Hide" : "Show"} Orders
              <span className="text-xs opacity-60">{showOrders ? "▲" : "▼"}</span>
            </button>
          </div>

          {showOrders && (
            <div className="flex flex-col gap-2 mt-5">
              {MOCK_ORDERS.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
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