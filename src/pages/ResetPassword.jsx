import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const email = useSelector((state) => state.user.user?.email);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const formHandler = async (e) => {
    try {
      e.preventDefault();
      console.log(email);

      const res = await axios.put(
        `${API_URL}/api/v1/user/change-password/${email}`,
        {
          newPassword: password,
          confirmPassword,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        console.log(res.data);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        <p className="text-gray-600 text-center mb-6">
          Please enter your new password below.
        </p>

        <form className="space-y-4" onSubmit={formHandler}>
          <div>
            <label className="block text-left text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-left text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
