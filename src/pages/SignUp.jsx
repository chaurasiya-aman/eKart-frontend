import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const formHandler = async (event) => {
    event.preventDefault();
    if (
      !formData.email.trim() ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.password.trim()
    ) {
      toast.error("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post(`${API_URL}/api/v1/user/register`, formData, {
        headers: { "Content-type": "application/json" },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => navigate("/verify"), 1000);
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputHandler = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-2xl mb-4">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Create account
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">Join eKart and start shopping</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={formHandler} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  onChange={inputHandler}
                  value={formData.firstName}
                  required
                  className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white h-11 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  onChange={inputHandler}
                  value={formData.lastName}
                  required
                  className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white h-11 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
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
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm cursor-pointer mt-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="text-center mt-5">
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}