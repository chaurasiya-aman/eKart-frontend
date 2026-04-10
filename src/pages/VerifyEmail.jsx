import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import api from "@/api/axios";
import "@/utils/VerifyEmail.css";

export function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const verifyEmail = async () => {
    setStatus("Verifying...");
    setSuccess(null);

    try {
      const res = await api.post(`${API_URL}/api/v1/user/verify/${token}`);

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
          "Verification failed",
      );
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const iconWrapClass =
    success === null
      ? "ve-icon-wrap ve-icon-wrap--pending"
      : success
        ? "ve-icon-wrap ve-icon-wrap--success"
        : "ve-icon-wrap ve-icon-wrap--error";

  const titleClass =
    success === null
      ? "ve-title ve-title--pending"
      : success
        ? "ve-title ve-title--success"
        : "ve-title ve-title--error";

  const description =
    success === null
      ? "Please wait while we verify your email."
      : success
        ? "Your email has been verified. You can now log in."
        : "The verification link is invalid or has expired.";

  return (
    <div className="ve-page">
      <Card className="ve-card">
        <CardHeader className="ve-card-header">
          <div className={iconWrapClass}>
            {success === null ? (
              <svg
                className="ve-spinner animate-spin"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : success ? (
              <CheckCircle className="ve-check-icon" />
            ) : (
              <XCircle className="ve-x-icon" />
            )}
          </div>

          <CardTitle className={titleClass}>{status}</CardTitle>

          <CardDescription className="ve-desc">{description}</CardDescription>
        </CardHeader>

        {success && (
          <CardFooter className="ve-footer">
            <Link to="/login" className="ve-login-btn">
              Go to Login
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}