import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder, clearOrderError } from "../../redux/reducer/orderSlice";
import {
  fetchAddresses,
  addAddress,
  setSelectedAddress,
  setToast,
} from "../../redux/reducer/Profileslice"; // adjust path

// ─── Inline Add Address Form ─────────────────────────────────────────────────
function AddAddressForm({ onCancel }) {
  const dispatch = useDispatch();
  const adding = useSelector((s) => s.profile.addingAddress);

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.street.trim()) e.street = "Street is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode))
      e.pincode = "Enter a valid 6-digit pincode";
    if (!form.country.trim()) e.country = "Country is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    // ✅ pincode from input is always string — good
    const result = await dispatch(addAddress(form));
    if (!result.error) onCancel();
  };

  const fields = [
    {
      name: "street",
      label: "Street / House No.",
      placeholder: "12, MG Road, Flat 3B",
      full: true,
    },
    { name: "city", label: "City", placeholder: "Mumbai" },
    { name: "state", label: "State", placeholder: "Maharashtra" },
    { name: "pincode", label: "Pincode", placeholder: "400001", maxLength: 6 },
    { name: "country", label: "Country", placeholder: "India" },
  ];

  return (
    <div className="mt-4 border border-dashed border-gray-300 rounded-xl p-5 bg-gray-50 animate-fade-up">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        New Delivery Address
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? "col-span-2" : "col-span-1"}>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {f.label}
            </label>
            <input
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              maxLength={f.maxLength}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-lg outline-none transition-colors placeholder:text-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-100
                ${errors[f.name] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
            />
            {errors[f.name] && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors[f.name]}
              </span>
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
          className="w-4 h-4 accent-gray-900 cursor-pointer"
        />
        <span className="text-xs text-gray-500">Save as default address</span>
      </label>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={adding}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {adding ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving…
            </span>
          ) : (
            "Save & Use This Address"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Address Selection Card ───────────────────────────────────────────────────
function AddressCard({ addr, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(addr)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-gray-900 bg-gray-50 shadow-sm"
          : "border-gray-100 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          {/* Radio indicator */}
          <span
            className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              isSelected ? "border-gray-900" : "border-gray-300"
            }`}
          >
            {isSelected && (
              <span className="w-2 h-2 rounded-full bg-gray-900 block" />
            )}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-800">{addr.street}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {addr.city}, {addr.state} — {addr.pincode}
            </p>
            <p className="text-xs text-gray-400">{addr.country}</p>
          </div>
        </div>
        {addr.isDefault && (
          <span className="shrink-0 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
            Default
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems } = useSelector((s) => s.cart);
  const { loading, error, success, currentOrder } = useSelector((s) => s.order);
  const { user } = useSelector((s) => s.auth);
  const { addresses, addressesLoading, addingAddress, selectedAddress } =
    useSelector((s) => s.profile);

  const [showAddForm, setShowAddForm] = useState(false);

  // Guards
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);
  useEffect(() => {
    if (success && currentOrder) {
      sessionStorage.setItem("current_order_id", currentOrder._id);
      navigate("/checkout/payment");
    }
  }, [success, currentOrder, navigate]);
  useEffect(() => {
    return () => dispatch(clearOrderError());
  }, [dispatch]);

  // Load saved addresses once
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleSelectAddress = (addr) => {
    dispatch(setSelectedAddress(addr));
    setShowAddForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SELECTED ADDRESS:", JSON.stringify(selectedAddress));
    if (!selectedAddress) return;

    if (!selectedAddress.pincode) {
    dispatch(setToast({ 
      msg: "This address is missing a pincode. Please delete it and add again.", 
      type: "error" 
    }));
    return;
  }

    const shippingAddress = {
      street: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: String(selectedAddress.pincode), 
      country: selectedAddress.country,
    };

    dispatch(createOrder(shippingAddress));
  };

  // Empty cart guard
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <p className="text-gray-500 text-base mb-4">Your cart is empty.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const displayTotal = cartItems.reduce((sum, item) => {
    const price =
      item.productId?.price?.amount ?? item.price?.amount ?? item.price ?? 0;
    const qty = item.qty ?? item.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 flex flex-wrap gap-6 items-start">
      {/* ── Left: Address Selection ── */}
      <div className="flex-1 min-w-80 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Delivery Address
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Select a saved address or add a new one
        </p>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Saved addresses */}
        {addressesLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-6">
            <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            Loading your addresses…
          </div>
        ) : addresses.length > 0 ? (
          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <AddressCard
                key={addr._id}
                addr={addr}
                isSelected={selectedAddress?._id === addr._id}
                onSelect={handleSelectAddress}
              />
            ))}
          </div>
        ) : (
          !showAddForm && (
            <div className="text-center py-6 text-gray-400 text-sm">
              <p className="text-2xl mb-2">📍</p>
              <p>No saved addresses yet.</p>
            </div>
          )
        )}

        {/* Add new address toggle */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Add New Address
          </button>
        ) : (
          <AddAddressForm onCancel={() => setShowAddForm(false)} />
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !selectedAddress || addingAddress}
          className="w-full mt-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg
                     hover:bg-gray-700 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Placing Order…
            </span>
          ) : !selectedAddress ? (
            "Select an address to continue"
          ) : (
            "Continue to Payment →"
          )}
        </button>

        {!selectedAddress && !addressesLoading && (
          <p className="text-center text-xs text-red-400 mt-2">
            Please select or add a delivery address
          </p>
        )}
      </div>

      {/* ── Right: Order Summary ── */}
      <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          Order Summary
        </h3>

        <div className="space-y-3">
          {cartItems.map((item) => {
            const name = item.productId?.name ?? item.name ?? "Product";
            const qty = item.qty ?? item.quantity ?? 1;
            const price =
              item.productId?.price?.amount ??
              item.price?.amount ??
              item.price ??
              0;
            return (
              <div
                key={item._id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-gray-700 truncate max-w-36">
                    {name}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded shrink-0">
                    x{qty}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 shrink-0">
                  ₹{(price * qty).toLocaleString("en-IN")}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 my-4" />

        {/* Selected address preview */}
        {selectedAddress && (
          <>
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Delivering to
              </p>
              <p className="text-xs text-gray-700 font-medium">
                {selectedAddress.street}
              </p>
              <p className="text-xs text-gray-400">
                {selectedAddress.city}, {selectedAddress.state} —{" "}
                {selectedAddress.pincode}
              </p>
            </div>
            <div className="border-t border-gray-100 my-4" />
          </>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-800">Total</span>
          <span className="text-base font-bold text-gray-900">
            ₹{displayTotal.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">
          Final amount confirmed after placing order
        </p>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .animate-fade-up { animation: fade-up .25s ease both; }
      `}</style>
    </div>
  );
}
