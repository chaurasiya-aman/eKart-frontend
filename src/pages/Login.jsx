import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

export function Login() {
  let [showPassword, setShowPassword] = useState(false);
  let [loading, setLoading] = useState(false);
  let [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formHandler = async (event) => {
    event.preventDefault();
    try {
      if (!formData.email.trim() || !formData.password.trim()) {
        toast.error("All fields are required");
        return;
      }

      setLoading(true);

      let res = await axios.post(
        `${API_URL}/api/v1/user/login`,
        formData,
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

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
          })
        );

        toast.success("Logged In Successfully");

        setTimeout(() => {
          toast.success(res.data.message);
        }, 1000);

        navigate("/");

        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleEyeIcon = () => {
    setShowPassword(!showPassword);
  };

  const inputHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div style={{ marginTop: "-60px" }} className="flex items-center justify-center min-h-screen bg-blue-100 p-2">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-700">
            Login
          </CardTitle>
        </CardHeader>

        <form onSubmit={formHandler} noValidate method="POST">
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={inputHandler}
                value={formData.email}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative flex">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="pr-10"
                  onChange={inputHandler} 
                  value={formData.password}
                  required
                />
                {showPassword ? (
                  <EyeOff
                    className="w-5 h-5 text-gray-700 absolute right-2 bottom-2 cursor-pointer"
                    onClick={toggleEyeIcon}
                  />
                ) : (
                  <Eye
                    className="w-5 h-5 text-gray-700 absolute right-2 bottom-2 cursor-pointer"
                    onClick={toggleEyeIcon}
                  />
                )}
              </div>
            </div>
          </CardContent>

          <div className="flex justify-center items-center">
            <CardAction>
              <div className="text-center text-sm text-muted-foreground my-2">
                Don't have an account?{" "}
                <Link to="/signup">
                  <Button
                    variant="link"
                    className="px-1 cursor-pointer hover:text-red-500"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
              <div className="text-center text-sm text-blue-500 my-2">
                <a href="/forgot-password">forgot password?</a>
              </div>
            </CardAction>
          </div>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Please wait
                </>
              ) : (
                <>Login</>
              )}
            </Button>
          </CardFooter>
        </form>

        <a href="/" className="hover:underline hover:text-red-500">
          back To Home
        </a>
      </Card>
    </div>
  );
}
