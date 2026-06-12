import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  resetFlow,
  resendOtp,
  sendLoginOtp,
  verifyLoginOtp,
} from "../redux/reducer/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";


const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { step, loading, error } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    phone: "",
    otp: "",
  });

  useEffect(() => {
    dispatch(resetFlow());
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = () => {
    dispatch(sendLoginOtp(form.phone));
  };

  const handleResendOtp = () => {
    dispatch(resendOtp({ phone: form.phone, type: "login" }));
  };

  const verifyOtp = async () => {
  try {
    const loginData = await dispatch(
      verifyLoginOtp({
        phone: form.phone,
        otp: form.otp,
      })
    ).unwrap();

    const from = location.state?.from?.pathname;

    if (from) {
      navigate(from, { replace: true });
    } else if (loginData.user.role === "admin") {
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
          {step === "idle" ? "Login" : "Verify Otp"}
        </h1>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <GoogleAuthButton redirectTo={redirectTo} />

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {step === "idle" && (
          <>
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? "Sending Otp" : "Send Otp"}
            </button>
          </>
        )}

        {step === "loginOtpSent" && (
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

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Verifying Otp" : "Verify & Login"}
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

export default Login;
