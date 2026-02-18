import { setUser } from "@/redux/userSlice";
import { CheckCircle } from "lucide-react";
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

  const inputHandler = (e) => {
    setEmail(e.target.value);
  };

  const formHandler = async (e) => {
    e.preventDefault();

    if (!email?.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(`${API_URL}/api/v1/user/forgot-password`, {
        email,
      });

      if (res.data.success) {
        setIsSuccess(true);
        toast.success("OTP Sent Successfully");
      }
    } catch (error) {
      console.log(error);
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

      const res = await api.post(
        `${API_URL}/api/v1/user/verify-otp/${email}`,
        { otp },
      );

      if (res.data.success) {
        dispatch(setUser({ email }));
        toast.success("OTP Verified Successfully");
        navigate("/reset-password");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      {!isSuccess ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Forgot Password?
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Enter your registered email address.
          </p>

          <form onSubmit={formHandler} className="space-y-4">
            <div>
              <label className="block text-left text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={inputHandler}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <div className="mb-4">
            <CheckCircle className="m-auto w-16 h-16 text-green-500" />
          </div>

          <h2 className="text-2xl font-semibold mb-2">OTP Sent Successfully</h2>

          <p className="text-gray-600 mb-4">
            We have sent a One-Time Password (OTP) to your registered email
            address.
          </p>

          <p className="text-gray-500 text-sm">
            Please check your inbox. If you don't see the email, kindly check
            your <span className="font-medium text-gray-700">Spam</span>
            or <span className="font-medium text-gray-700">Junk</span> folder as
            well.
          </p>

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter your OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
