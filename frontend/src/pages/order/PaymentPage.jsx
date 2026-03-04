import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPayment, verifyPayment, resetPayment } from "../../redux/reducer/paymentSlice";
import { clearCurrentOrder } from "../../redux/reducer/orderSlice";
import { clearCart } from "../../redux/reducer/cartSlice";

// ─── Load Razorpay script dynamically ─────────────────────────
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true); // already loaded
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
  const { status, error, paymentData } = useSelector((state) => state.payment);

  // orderId — prefer Redux, fallback to sessionStorage
  const orderId =
    currentOrder?._id ?? sessionStorage.getItem("current_order_id");

  // ── Guards ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!orderId) navigate("/checkout"); // no order → back to checkout
  }, [orderId, navigate]);

  // ── Cleanup on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => dispatch(resetPayment());
  }, [dispatch]);

  // ── Main payment handler ───────────────────────────────────
  const handlePayNow = async () => {
    // 1. Load Razorpay SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay. Check your internet connection.");
      return;
    }

    // 2. Create payment on backend → get razorpayOrderId
    const result = await dispatch(createPayment(orderId));
    if (createPayment.rejected.match(result)) return; // error shown via state

    const { razorpayOrderId, price } = result.payload.newPayment;

    // 3. Open Razorpay checkout
    const options = {
      // VITE project: import.meta.env.VITE_RAZORPAY_KEY_ID
      // CRA project : process.env.REACT_APP_RAZORPAY_KEY_ID
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: price.amount,           // in paise — backend sets this
      currency: price.currency,       // "INR"
      order_id: razorpayOrderId,      // from backend createPayment response
      name: "Vernika Organic",
      description: `Order #${orderId}`,
      prefill: {
        name: user?.name ?? "",
        email: user?.email ?? "",
        contact: user?.phone ?? "",
      },
      theme: { color: "#111111" },

      // ── SUCCESS: Razorpay calls this after payment ──
      handler: async (response) => {
        // response shape from Razorpay SDK:
        // { razorpay_order_id, razorpay_payment_id, razorpay_signature }
        const verifyResult = await dispatch(
          verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          })
        );

        if (verifyPayment.fulfilled.match(verifyResult)) {
          // ✅ Payment verified — clean up and go to success
          dispatch(clearCart());
          dispatch(clearCurrentOrder());
          sessionStorage.removeItem("current_order_id");
          navigate(`/order/success/${orderId}`);
        }
        // if rejected — error is shown via state.payment.error
      },

      modal: {
        // User closed the Razorpay modal without paying
        ondismiss: () => {
          dispatch(resetPayment());
          // Stay on payment page — user can retry
        },
      },
    };

    const rzp = new window.Razorpay(options);

    // ── PAYMENT FAILED (card declined, timeout etc.) ──
    rzp.on("payment.failed", (response) => {
      console.error("Razorpay payment failed:", response.error);
      dispatch(resetPayment());
      // Error description from Razorpay
      navigate("/order/failed", {
        state: { reason: response.error.description },
      });
    });

    rzp.open();
  };

  // ── Render ────────────────────────────────────────────────
  const isLoading = status === "initiating" || status === "verifying";

  return (
    <div className="max-w-md mx-auto px-4 py-16 flex flex-col items-center gap-6">

      {/* Order info card */}
      <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
        <div className="text-3xl mb-3">🔒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Secure Payment</h2>
        <p className="text-sm text-gray-500 mb-4">Powered by Razorpay</p>

        {orderId && (
          <div className="bg-gray-50 rounded-lg px-4 py-2 inline-block">
            <span className="text-xs text-gray-500">Order ID: </span>
            <span className="text-xs font-mono font-semibold text-gray-700">
              {orderId}
            </span>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="w-full flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          <span className="mt-0.5 shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Verifying state */}
      {status === "verifying" && (
        <div className="w-full flex items-center justify-center gap-3 bg-blue-50 border border-blue-100 text-blue-700 text-sm px-4 py-3 rounded-lg">
          <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Verifying your payment… please wait</span>
        </div>
      )}

      {/* Pay Now button */}
      <button
        onClick={handlePayNow}
        disabled={isLoading}
        className="w-full py-4 bg-gray-900 text-white font-semibold text-base rounded-xl
                   hover:bg-gray-700 transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "initiating" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Opening Razorpay…
          </span>
        ) : status === "verifying" ? (
          "Verifying Payment…"
        ) : (
          "Pay Now"
        )}
      </button>

      {/* Back link */}
      <button
        onClick={() => navigate("/checkout")}
        disabled={isLoading}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
      >
        ← Change delivery address
      </button>

    </div>
  );
}