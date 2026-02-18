import React from "react";

const Login = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    otp: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/auth/login-phone",
        {
          phone: form.phone,
        },
        {
          withCredentials: true,
        },
      );
      setStep(2);
    } catch (error) {
      console.error("Error Sending Otp", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/auth/verify-login-otp",
        {
          phone: form.phone,
          otp: form.otp,
        },
        {
          withCredentials: true,
        },
      );
      navigate("/");
    } catch (error) {
      console.error("Error Verifying Otp", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {step === 1 ? "Login" : "Verify Otp"}
        </h1>

        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition mb-6">
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.827 32.657 29.285 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.964 3.036l5.657-5.657C34.053 6.053 29.277 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.964 3.036l5.657-5.657C34.053 6.053 29.277 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.178 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.267 0-9.799-3.326-11.289-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-1.062 3.118-3.077 5.583-5.884 7.161l6.19 5.238C39.99 36.55 44 30.789 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>

          <span className="font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {step === 1 && (
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

        {step === 2 && (
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
              {loading ? "Verifying Otp" : "Verify & Signup"}
            </button>

            <p
              onClick={() => setStep(1)}
              className="text-center text-sm text-indigo-600 mt-4 cursor-pointer"
            >
              Edit details
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
