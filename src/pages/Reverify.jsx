import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MailCheck, RefreshCw } from "lucide-react";
import "@/utils/Reverify.css";
import api from "@/api/axios";

export default function Reverify() {
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);

      const email = localStorage.getItem("userEmail");
      console.log("Revirfy email:" , email)

      await api.post(`/api/v1/user/reVerify`, { email });

      setResent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reverify-page">
      <Card className="reverify-card">
        <CardHeader className="reverify-card-header">
          <div className="reverify-icon-wrap">
            <MailCheck className="reverify-icon" />
          </div>

          <CardTitle className="reverify-title">Re-verify Your Email</CardTitle>

          <CardDescription className="reverify-desc">
            Your verification link may have expired or was not used in time.
            Click the button below to receive a new verification link at your
            registered email address. Check your inbox — and your Spam or Junk
            folder if you don't see it within a few minutes.
          </CardDescription>
        </CardHeader>

        <CardContent className="reverify-card-content">
          {resent && (
            <div className="reverify-success-banner">
              <MailCheck size={16} />A new verification link has been sent to
              your email.
            </div>
          )}
        </CardContent>

        <CardFooter className="reverify-footer">
          <button
            className={`reverify-resend-btn ${loading ? "loading" : ""} ${resent ? "sent" : ""}`}
            onClick={handleResend}
            disabled={loading || resent}
          >
            <RefreshCw
              className={`reverify-resend-icon ${loading ? "spin" : ""}`}
              size={16}
            />
            {loading
              ? "Sending..."
              : resent
                ? "Email Sent!"
                : "Resend Verification Email"}
          </button>

          <Link to="/login" className="reverify-back-link">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
