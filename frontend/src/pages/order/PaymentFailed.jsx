import { Link, useLocation } from "react-router-dom";
import { CircleAlert } from "lucide-react";

export default function PaymentFailed() {
  const location = useLocation();
  const reason = location.state?.reason || "Payment could not be completed.";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-md text-center bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
        <CircleAlert className="mx-auto text-red-500" size={56} />
        <h1 className="mt-5 text-2xl font-semibold text-gray-900">
          Payment failed
        </h1>
        <p className="mt-2 text-sm text-gray-500">{reason}</p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/checkout"
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Try again
          </Link>
          <Link
            to="/product"
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Shop
          </Link>
        </div>
      </section>
    </main>
  );
}
