import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder, clearOrderError } from "../../redux/reducer/orderSlice";

const emptyAddress = {
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems, totals } = useSelector((state) => state.cart);
  const { loading, error, success, currentOrder } = useSelector(
    (state) => state.order,
  );
  const { user } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(emptyAddress);
  const [formErrors, setFormErrors] = useState({});

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

  const validate = () => {
    const errors = {};
    if (!address.street.trim()) errors.street = "Street is required";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.state.trim()) errors.state = "State is required";
    if (!/^\d{6}$/.test(address.pincode))
      errors.pincode = "Enter a valid 6-digit pincode";
    if (!address.country.trim()) errors.country = "Country is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    dispatch(createOrder(address));
  };

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
      {/* ── Left: Address Form ── */}
      <div className="flex-1 min-w-80 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Delivery Address
        </h2>

        {/* Backend error banner */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Street — full width */}
          <Field
            label="Street / House No."
            name="street"
            value={address.street}
            onChange={handleChange}
            error={formErrors.street}
            placeholder="e.g. 12, MG Road, Flat 3B"
          />

          {/* City + State */}
          <div className="flex gap-4">
            <Field
              label="City"
              name="city"
              value={address.city}
              onChange={handleChange}
              error={formErrors.city}
              placeholder="Mumbai"
            />
            <Field
              label="State"
              name="state"
              value={address.state}
              onChange={handleChange}
              error={formErrors.state}
              placeholder="Maharashtra"
            />
          </div>

          {/* Pincode + Country */}
          <div className="flex gap-4">
            <Field
              label="Pincode"
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              error={formErrors.pincode}
              placeholder="400001"
              maxLength={6}
            />
            <Field
              label="Country"
              name="country"
              value={address.country}
              onChange={handleChange}
              error={formErrors.country}
              placeholder="India"
            />
          </div>

          {/* Submit */}
          <button
            onClick={()=>{
              navigate("/checkout/payment")
            }}
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg
                       hover:bg-gray-700 transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Placing Order…
              </span>
            ) : (
              "Continue to Payment →"
            )}
          </button>
        </form>
      </div>

      {/* ── Right: Order Summary ── */}
      <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          Order Summary
        </h3>

        {/* Items list */}
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

        {/* Total row */}
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
    </div>
  );
}

// ─── Reusable Field ───────────────────────────────────────────
function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  maxLength,
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-3.5 py-2.5 text-sm text-gray-900 border rounded-lg outline-none
                    transition-colors placeholder:text-gray-300
                    focus:border-gray-500 focus:ring-2 focus:ring-gray-100
                    ${
                      error
                        ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 bg-white"
                    }`}
      />
      {error && (
        <span className="block text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
}
