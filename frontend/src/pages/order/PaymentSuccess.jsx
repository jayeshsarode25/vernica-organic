import { Link, useParams } from "react-router-dom";
import { CircleCheckBig } from "lucide-react";

export default function PaymentSuccess() {
  const { orderId } = useParams();

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-md text-center bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
        <CircleCheckBig className="mx-auto text-green-600" size={56} />
        <h1 className="mt-5 text-2xl font-semibold text-gray-900">
          Payment successful
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your order has been placed successfully.
        </p>
        {orderId && (
          <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 font-mono text-sm text-gray-700">
            {orderId}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <Link
            to="/user-profile"
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
          >
            My orders
          </Link>
          <Link
            to="/product"
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
