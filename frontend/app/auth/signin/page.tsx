"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { PageTransition } from "@/components/page-transition";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  X,
} from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const success = await signIn(email, password);

      if (success) {
        const storedUser = JSON.parse(
          localStorage.getItem("edupredict_user") || "{}"
        );

        toast({
          title: "Welcome back!",
          description: "Redirecting to your dashboard...",
        });

        router.push("/dashboard");
      } else {
        toast({
          title: "Sign in failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Google Sign-In",
      description: "Google authentication will be integrated with your backend.",
    });
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setResetEmail("");
    setResetEmailError("");
    setShowResetConfirmation(false);
  };

  const handleSendResetEmail = () => {
    if (!resetEmail.trim()) {
      setResetEmailError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setResetEmailError("Please enter a valid email");
      return;
    }
    setResetEmailError("");
    setShowResetConfirmation(true);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setShowResetConfirmation(false);
      setShowForgotPassword(false);
    }, 4000);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setResetEmailError("");
    setShowResetConfirmation(false);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Back button */}
        <div className="p-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <div className="mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <GraduationCap className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">
                  EduPredict
                </span>
              </Link>
              <h1 className="mt-6 text-2xl font-bold text-foreground">
                Welcome back
              </h1>
              <p className="mt-2 text-muted-foreground">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`rounded-xl ${errors.email ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`rounded-xl pr-10 ${errors.password ? "border-destructive" : ""}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-border" />
                <span className="px-4 text-sm text-muted-foreground">or</span>
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl bg-transparent"
                onClick={handleGoogleSignIn}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Sign Up Link */}
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {"Don't have an account?"}{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {showForgotPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
              onClick={handleCloseForgotPassword}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleCloseForgotPassword}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>

                {!showResetConfirmation ? (
                  <>
                    <h2 className="mb-2 text-xl font-bold text-foreground">
                      Reset Password
                    </h2>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Enter your email address and we will send you a password
                      reset link.
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className={`rounded-xl ${resetEmailError ? "border-destructive" : ""}`}
                        />
                        {resetEmailError && (
                          <p className="text-sm text-destructive">
                            {resetEmailError}
                          </p>
                        )}
                      </div>

                      <Button
                        type="button"
                        className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={handleSendResetEmail}
                      >
                        Send
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                      <svg
                        className="h-6 w-6 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-foreground">
                      Password reset link has been sent to your email.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
