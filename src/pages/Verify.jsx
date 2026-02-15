import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export function Verify() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>

          <CardTitle className="text-xl font-bold text-blue-700">
            Verify Your Email
          </CardTitle>

          <CardDescription className="text-sm">
            We’ve sent a verification link to your registered email address.
            Please check your inbox and click the link to activate your account.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            disabled
          >
            Waiting for verification...
          </Button>

          <Link
            to="/login"
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
