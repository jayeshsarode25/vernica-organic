import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  clearCart,
  removeCartItem,
  updateCartItem,
} from "../../redux/reducer/cartSlice";

const CartDrawer = ({ open, setOpen }) => {
  const items = useSelector((state) => state.cart.items || []);

  const dispatch = useDispatch();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((acc, item) => {
    if (!item?.productId) return acc;
    return acc + (item.productId.price?.amount || 0) * item.quantity;
  }, 0);

  const total = Math.max(subtotal - discount, 0);

  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(subtotal * 0.1);
    } else if (coupon === "SAVE100") {
      setDiscount(100);
    } else {
      alert("Invalid Coupon");
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-5 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>

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

              return (
                <div key={item._id} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.productId.images?.[0]?.url}
                    alt={item.productId.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {item.productId.title}
                    </h4>

                    <p className="text-gray-500 text-sm">
                      ₹{item.productId.price?.amount}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        className="border px-2 rounded"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              productId,
                              qty: item.quantity - 1,
                            }),
                          )
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        className="border px-2 rounded"
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              productId,
                              qty: item.quantity + 1,
                            }),
                          )
                        }
                      >
                        +
                      </button>

                      <button
                        className="text-red-500 text-xs ml-auto"
                        onClick={() => dispatch(removeCartItem(productId))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="border flex-1 px-3 py-2 rounded-lg text-sm"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-black text-white px-4 rounded-lg text-sm"
                >
                  Apply
                </button>
              </div>

              {discount > 0 && (
                <p className="text-green-600 text-sm">
                  Discount Applied: −₹{discount}
                </p>
              )}

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
                Checkout
              </button>

              <button
                className="w-full border py-3 rounded-xl"
                onClick={() => dispatch(clearCart())}
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
