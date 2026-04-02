import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import {
  clearCart,
  removeCartItem,
  updateCartItem,
  applyDiscount,
  clearDiscount,
} from "../../redux/reducer/cartSlice";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ discount now comes from Redux, not local state
  const { items = [], addingIds, removingIds, discount, couponCode } = useSelector((state) => state.cart);

  const [coupon, setCoupon] = useState("");

  // ── Auto-open drawer when a product is added ───────────────────
  const prevAddingLen = useRef(0);
  useEffect(() => {
    if (prevAddingLen.current > 0 && addingIds.length === 0) {
      setOpen(true);
    }
    prevAddingLen.current = addingIds.length;
  }, [addingIds, setOpen]);

  // ── Sync coupon input with Redux couponCode ────────────────────
  useEffect(() => {
    if (couponCode) setCoupon(couponCode);
  }, [couponCode]);

  // ── Totals ─────────────────────────────────────────────────────
  const subtotal = items.reduce((acc, item) => {
    if (!item?.productId) return acc;
    return acc + (item.productId.price?.amount || 0) * item.quantity;
  }, 0);

  const total = Math.max(subtotal - discount, 0);

  // ✅ dispatch to Redux instead of local setState
  const applyCoupon = () => {
    if (coupon === "SAVE10")
      dispatch(applyDiscount({ discount: subtotal * 0.1, couponCode: coupon }));
    else if (coupon === "SAVE100")
      dispatch(applyDiscount({ discount: 100, couponCode: coupon }));
    else
      alert("Invalid Coupon");
  };

  const handleRemoveCoupon = () => {
    dispatch(clearDiscount());
    setCoupon("");
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">

          {/* ── Header ── */}
          <div className="flex justify-between items-center p-5 border-b">
            <h2 className="text-xl font-bold">
              Your Cart
              {items.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({items.length} item{items.length !== 1 ? "s" : ""})
                </span>
              )}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-black text-xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* ── Items ── */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {items.length === 0 && (
              <p className="text-gray-500 text-center mt-10">
                Your cart is empty
              </p>
            )}

            {items.map((item) => {
              if (!item?.productId) return null;

              const productId =
                item.productId._id?.toString() || item.productId?.toString();
              if (!productId) return null;

              const isUpdating = addingIds.includes(productId);
              const isRemoving = removingIds.includes(productId);
              const isDisabled = isUpdating || isRemoving;

              return (
                <div
                  key={item._id}
                  className={`flex gap-4 border-b pb-4 transition-opacity ${
                    isRemoving ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <img
                    src={item.productId.images?.[0]?.url}
                    alt={item.productId.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {item.productId.title}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      ₹{item.productId.price?.amount}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {/* Decrement */}
                      <button
                        disabled={item.quantity <= 1 || isDisabled}
                        onClick={() =>
                          dispatch(updateCartItem({ productId, qty: item.quantity - 1 }))
                        }
                        className="border px-2 rounded disabled:opacity-40 hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>

                      {/* Quantity / spinner */}
                      {isUpdating ? (
                        <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : (
                        <span className="w-5 text-center">{item.quantity}</span>
                      )}

                      {/* Increment */}
                      <button
                        disabled={isDisabled}
                        onClick={() =>
                          dispatch(updateCartItem({ productId, qty: item.quantity + 1 }))
                        }
                        className="border px-2 rounded disabled:opacity-40 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>

                      {/* Remove */}
                      <button
                        disabled={isDisabled}
                        onClick={() => dispatch(removeCartItem(productId))}
                        className="text-red-500 text-xs ml-auto disabled:opacity-40 hover:text-red-700 transition-colors"
                      >
                        {isRemoving ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Footer ── */}
          {items.length > 0 && (
            <div className="p-5 border-t space-y-4">
              {/* Coupon */}
              {/* ✅ Hide input if coupon already applied */}
              {!couponCode ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    className="border flex-1 px-3 py-2 rounded-lg text-sm outline-none focus:border-emerald-400"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-black text-white px-4 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                // ✅ Show applied coupon pill with remove button
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <p className="text-green-700 text-sm font-medium">
                    🎉 {couponCode} applied
                  </p>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 text-xs hover:text-red-500 transition-colors ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Subtotal */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>−₹{discount.toFixed(2)}</span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {/* Checkout */}
              <button
                onClick={() => { setOpen(false); navigate("/checkout"); }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Checkout
              </button>

              {/* Clear cart */}
              <button
                onClick={() => dispatch(clearCart())}
                className="w-full border py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CartDrawer;