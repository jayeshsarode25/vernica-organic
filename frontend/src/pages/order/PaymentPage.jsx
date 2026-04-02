import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createPayment,
  verifyPayment,
  resetPayment,
} from "../../redux/reducer/paymentSlice";
import { clearCurrentOrder } from "../../redux/reducer/orderSlice";
import { clearCart } from "../../redux/reducer/cartSlice";

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

  const isMountedRef = useRef(true);
  const hasOpenedRef = useRef(false);

  const orderId =
    currentOrder?._id ?? sessionStorage.getItem("current_order_id");

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!orderId) {
      navigate("/checkout", { replace: true });
      return;
    }
    if (hasOpenedRef.current) return;

    hasOpenedRef.current = true;
    openRazorpay();
  }, [user, orderId, navigate]);

  const handleDismiss = () => {
    if (!isMountedRef.current) return;
    dispatch(resetPayment());
    sessionStorage.removeItem("current_order_id");
    dispatch(clearCurrentOrder());
    navigate("/checkout", { replace: true });
  };

  const handlePaymentSuccess = async (response) => {
    if (!isMountedRef.current) return;

    const verifyResult = await dispatch(
      verifyPayment({
        razorpayOrderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
      })
    );

    if (!isMountedRef.current) return;

    if (verifyPayment.fulfilled.match(verifyResult)) {
      dispatch(clearCart());
      dispatch(clearCurrentOrder());
      sessionStorage.removeItem("current_order_id");
      navigate(`/order/success/${orderId}`, { replace: true });
    }
  };

  const handlePaymentFailed = (response) => {
    if (!isMountedRef.current) return;
    dispatch(resetPayment());
    dispatch(clearCurrentOrder());
    sessionStorage.removeItem("current_order_id");
    navigate("/order/failed", {
      state: { reason: response.error.description },
      replace: true,
    });
  };

  const openRazorpay = async () => {
    if (!isMountedRef.current) return;

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      if (!isMountedRef.current) return;
      alert("Failed to load Razorpay. Please try again.");
      dispatch(resetPayment());
      navigate("/checkout", { replace: true });
      return;
    }

    if (!isMountedRef.current) return;

    const result = await dispatch(createPayment(orderId));

    if (!isMountedRef.current) return;
    if (createPayment.rejected.match(result)) return;
    if (!isMountedRef.current) return;

    const { razorpayOrderId, price } = result.payload.newPayment;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: price.amount,       // ✅ this now comes from order.totalPrice (discounted)
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
      handler: (response) => {
        handlePaymentSuccess(response);
      },
      modal: {
        ondismiss: () => {
          handleDismiss();
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      handlePaymentFailed(response);
    });
    rzp.open();
  };

  const isLoading = status === "initiating" || status === "verifying";

  // ✅ Show both original and discounted price if discount was applied
  const originalAmount = currentOrder?.items?.reduce(
    (sum, item) => sum + (item.price?.amount || 0), 0
  );
  const finalAmount = currentOrder?.totalPrice?.amount;
  const hasDiscount = originalAmount && finalAmount && originalAmount > finalAmount;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm w-full">

        {/* ✅ Price Summary — shows discount breakdown if applicable */}
        {currentOrder?.totalPrice && (
          <div className="w-full bg-white border border-gray-100 rounded-xl px-6 py-4 shadow-sm">
            <p className="text-sm text-gray-400 mb-2">Price Summary</p>

            {hasDiscount && (
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Original</span>
                <span className="line-through">₹{originalAmount?.toLocaleString("en-IN")}</span>
              </div>
            )}

            {hasDiscount && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>Discount</span>
                <span>−₹{(originalAmount - finalAmount).toLocaleString("en-IN")}</span>
              </div>
            )}

            <p className="text-2xl font-bold text-gray-900">
              ₹{finalAmount?.toLocaleString("en-IN")}
            </p>
          </div>
        )}

        {/* Loading State */}
        {!error && (
          <>
            <span className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
            <div>
              <p className="text-base font-semibold text-gray-800">
                {status === "verifying"
                  ? "Verifying payment…"
                  : "Opening payment gateway…"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Please wait, do not refresh
              </p>
            </div>
          </>
        )}

        {/* Error State */}
        {error && (
          <>
            <span className="text-4xl">⚠️</span>
            <p className="text-base font-semibold text-gray-800">Payment failed</p>
            <p className="text-sm text-red-500">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  hasOpenedRef.current = false;
                  dispatch(resetPayment());
                  openRazorpay();
                }}
                disabled={isLoading}
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold
                           rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                Retry
              </button>
              <button
                onClick={() => { handleDismiss(); }}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm
                           font-medium rounded-lg hover:bg-gray-50 transition-colors"
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