import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import api from "@/api/axios";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formHandler = async (event) => {
    event.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("All fields are required");
      return;
    }
    try {
      setLoading(true);
      localStorage.setItem("userEmail", formData.email);
      const res = await api.post(`/api/v1/user/login`, formData, {
        headers: { "Content-type": "application/json" },
      });
      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken);
        dispatch(
          setUser({
            _id: res.data.user._id,
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName,
            profilePic: res.data.user.profilePic,
            email: res.data.user.email,
            role: res.data.user.role,
            isVerified: res.data.user.isVerified,
          }),
        );
        toast.success("Logged In Successfully");
        setTimeout(() => toast.success(res.data.message), 1000);
        navigate("/");
        setFormData({ email: "", password: "" });
      }
    } catch (error) {
      console.error(error);

      const message = error?.response?.data?.message || "Login failed";

      toast.error(message);

      if (message === "User does not exist") {
        navigate("/signup");
      }
      if (message === "Please verify your account first") {
        navigate("/re-verify");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputHandler = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-2xl mb-4">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Sign in to your eKart account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={formHandler} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={inputHandler}
                value={formData.email}
                required
                className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white h-11 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="pr-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white h-11 text-sm"
                  onChange={inputHandler}
                  value={formData.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm cursor-pointer mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
