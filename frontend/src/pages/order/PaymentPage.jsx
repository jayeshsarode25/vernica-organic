import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPayment, verifyPayment, resetPayment } from "../../redux/reducer/paymentSlice";
import { clearCurrentOrder } from "../../redux/reducer/orderSlice";
import { clearCart } from "../../redux/reducer/cartSlice";

// ─── Load Razorpay Script ──────────────────────────────────────
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { currentOrder } = useSelector((state) => state.order);
  const { status, error } = useSelector((state) => state.payment);

  const orderId =
    currentOrder?._id ?? sessionStorage.getItem("current_order_id");

  // ── Guards ────────────────────────────────────────────────
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!orderId) navigate("/checkout");
  }, [orderId, navigate]);

  // ── Auto-trigger Razorpay when page loads ─────────────────
  useEffect(() => {
    if (orderId && user) {
      handlePayNow();
    }
  }, []); // runs once on mount

  // ── Cleanup on unmount ────────────────────────────────────
  useEffect(() => {
    return () => dispatch(resetPayment());
  }, [dispatch]);

  // ── Main handler ──────────────────────────────────────────
  const handlePayNow = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay. Check your internet connection.");
      return;
    }

    // Step 1 — create payment on backend
    const result = await dispatch(createPayment(orderId));
    if (createPayment.rejected.match(result)) return;

    const { razorpayOrderId, price } = result.payload.newPayment;

    // Step 2 — open Razorpay modal (Razorpay handles method selection)
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: price.amount,
      currency: price.currency,
      order_id: razorpayOrderId,
      name: "Your Store",
      description: `Order #${orderId}`,
      prefill: {
        name: user?.name ?? "",
        email: user?.email ?? "",
        contact: user?.phone ?? "",
      },
      theme: { color: "#111111" },

      // ── Payment success ──
      handler: async (response) => {
        const verifyResult = await dispatch(
          verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          })
        );
        if (verifyPayment.fulfilled.match(verifyResult)) {
          dispatch(clearCart());
          dispatch(clearCurrentOrder());
          sessionStorage.removeItem("current_order_id");
          navigate(`/order/success/${orderId}`);
        }
      },

      modal: {
        // User closed Razorpay modal — go back to checkout
        ondismiss: () => {
          dispatch(resetPayment());
          navigate("/checkout");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      dispatch(resetPayment());
      navigate("/order/failed", { state: { reason: response.error.description } });
    });
    rzp.open();
  };

  const isLoading = status === "initiating" || status === "verifying";

  // ── Render — shown briefly while Razorpay loads ───────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center">

        {/* Loading / verifying state */}
        {!error && (
          <>
            <span className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
            <div>
              <p className="text-base font-semibold text-gray-800">
                {status === "verifying"
                  ? "Verifying your payment…"
                  : "Opening Razorpay…"}
              </p>
              <p className="text-sm text-gray-400 mt-1">Please wait, do not refresh</p>
            </div>
          </>
        )}

        {/* Error state — show retry button */}
        {error && (
          <>
            <span className="text-4xl">⚠️</span>
            <div>
              <p className="text-base font-semibold text-gray-800">Payment initiation failed</p>
              <p className="text-sm text-red-500 mt-1">{error}</p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={handlePayNow}
                disabled={isLoading}
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg
                           hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                Retry Payment
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium
                           rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}