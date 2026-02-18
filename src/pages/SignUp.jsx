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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/api/axios";

export function SignUp() {
  let [showPassword, setShowPassword] = useState(false);
  let [loading, setLoading] = useState(false);
  let [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const formHandler = async (event) => {
    event.preventDefault();

    try {
      if (
        !formData.email.trim() ||
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.password.trim()
      ) {
        toast.error("All fields are required");
        return;
      }

      setLoading(true);

      let res = await api.post(
        `${API_URL}/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      console.log(res.data);

      if (res.data.success) {
        toast.success(res.data.message);

        setTimeout(() => {
          navigate("/verify");
        }, 1000);

        setFormData({
          firstName: "",
          lastName: "",
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
    <div
      style={{ marginTop: "-60px" }}
      className="flex items-center justify-center min-h-screen bg-blue-100 p-2"
    >
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-700">
            Sign Up
          </CardTitle>
          <CardDescription className="text-sm">
            Create Your Account Here
          </CardDescription>
        </CardHeader>

        <form onSubmit={formHandler} noValidate method="POST">
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  onChange={inputHandler}
                  value={formData.firstName}
                  required
                />
              </div>

              <div className="flex-1 space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  onChange={inputHandler}
                  value={formData.lastName}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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
                Already have an account?{" "}
                <Link to="/login">
                  <Button
                    variant="link"
                    className="px-1 cursor-pointer hover:text-red-500"
                  >
                    Login
                  </Button>
                </Link>
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
                <>Sign Up</>
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
