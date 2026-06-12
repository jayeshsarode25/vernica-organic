import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  resetFlow,
  resendOtp,
  sendSignupOtp,
  verifySignupOtp,
} from "../redux/reducer/userSlice";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";

const SignUp = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { step, loading, error } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    phone: "",
    name: "",
    email: "",
    otp: "",
    password: "",
  });

  useEffect(() => {
    dispatch(resetFlow());
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = () => {
    dispatch(
      sendSignupOtp({
        phone: form.phone,
        name: form.name,
        email: form.email,
      }),
    );
  };

  const handleResendOtp = () => {
    dispatch(resendOtp({ phone: form.phone, type: "signup" }));
  };

  const verifyOtp = async () => {
    try {
      const signupData = await dispatch(
        verifySignupOtp({
          phone: form.phone,
          otp: form.otp,
          password: form.password,
        }),
      ).unwrap();

      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else if (signupData.user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {step === "signupOtpSent" ? "Verify OTP" : "SignUp"}
        </h1>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {step === "idle" && (
          <>
            <GoogleAuthButton redirectTo={redirectTo} />

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          </>
        )}

        {step === "idle" && (
          <>
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:border-indigo-500"
            />

            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:border-indigo-500"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg mb-6 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "signupOtpSent" && (
          <>
            <input
              value={form.phone}
              disabled
              className="w-full border p-3 rounded-lg mb-4 bg-gray-100"
            />

            <input
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:border-indigo-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg mb-6 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Verifying..." : "Verify & Signup"}
            </button>

            <p
              onClick={() => dispatch(resetFlow())}
              className="text-center text-sm text-indigo-600 mt-4 cursor-pointer"
            >
              Edit details
            </p>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="mt-3 w-full text-sm font-medium text-green-700 hover:text-green-800 disabled:text-gray-400"
            >
              Resend OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
