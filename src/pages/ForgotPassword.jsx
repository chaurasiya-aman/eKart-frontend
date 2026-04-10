import { setUser } from "@/redux/userSlice";
import { CheckCircle, Loader2, KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  const formHandler = async (e) => {
    e.preventDefault();
    if (!email?.trim()) {
      toast.error("Email is required");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post(`${API_URL}/api/v1/user/forgot-password`, { email });
      if (res.data.success) {
        setIsSuccess(true);
        toast.success("OTP Sent Successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post(`${API_URL}/api/v1/user/verify-otp/${email}`, { otp });
      if (res.data.success) {
        dispatch(setUser({ email }));
        toast.success("OTP Verified Successfully");
        navigate("/reset-password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-md">
        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-2xl mb-4">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-gray-500 text-sm mt-1.5 max-w-xs mx-auto">
                Enter your registered email and we'll send you an OTP to reset your password.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <form onSubmit={formHandler} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2.5 rounded-xl transition-colors font-semibold text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Send OTP"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-2xl mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Check Your Email
              </h1>
              <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                We sent a 6-digit OTP to{" "}
                <span className="font-semibold text-gray-700">{email}</span>.
                Check your spam folder if you don't see it.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 block">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="• • • • • •"
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-[0.5em] font-semibold transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2.5 rounded-xl transition-colors font-semibold text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  ← Use a different email
                </button>
              </form>
            </div>
          </>
        )}

        <div className="text-center mt-5">
          <a href="/login" className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}