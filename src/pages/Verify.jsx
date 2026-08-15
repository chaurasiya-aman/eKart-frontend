import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import "@/utils/Verify.css";

export function Verify() {
  return (
    <div className="verify-page">
      <Card className="verify-card">
        <CardHeader className="verify-card-header">
          <div className="verify-icon-wrap">
            <Mail className="verify-icon" />
          </div>

          <CardTitle className="verify-title">
            Verify Your Email
          </CardTitle>

          <CardDescription className="verify-desc">
            We've sent a verification link to your registered email address.
            Please check your inbox and click the link to activate your account.
            If you don't receive it within a few minutes, check your Spam or
            Junk folder and move it to your inbox.
          </CardDescription>
        </CardHeader>

        <CardFooter className="verify-footer">
          <div className="verify-waiting-btn">
            <span className="verify-waiting-dot" />
            Waiting for verification...
          </div>
          <Link to="/re-verify" className="verify-back-link">
            Resend Email
          </Link>

          <Link to="/login" className="verify-back-link">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}