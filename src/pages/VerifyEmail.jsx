import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const verifyEmail = async () => {
    setStatus("Verifying...");
    setSuccess(null);

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/user/verify/${token}`
      );

      if (res.data.success) {
        setSuccess(true);
        setStatus(res.data.message || "Email Verified Successfully");
      } else {
        setSuccess(false);
        setStatus(res.data.message || "Verification failed");
      }
    } catch (error) {
      setSuccess(false);
      setStatus(
        error.response?.data?.message ||
          error.message ||
          "Verification failed"
      );
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            {success === null ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-12 w-12 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : success ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>

          {success === null ? (
            <CardTitle className="text-xl font-bold text-gray-700">
              {status}
            </CardTitle>
          ) : (
            <CardTitle
              className={`text-xl font-bold ${
                success ? "text-green-700" : "text-red-600"
              }`}
            >
              {status}
            </CardTitle>
          )}

          <CardDescription className="text-sm">
            {success === null
              ? "Please wait while we verify your email."
              : success
              ? "Your email has been verified. You can now log in."
              : "The verification link is invalid or has expired."}
          </CardDescription>
        </CardHeader>

        {success && (
          <CardFooter className="flex flex-col gap-3">
            <Link to="/login">
              <Button className="w-full cursor-pointer bg-green-600 hover:bg-green-500">
                Go to Login
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
