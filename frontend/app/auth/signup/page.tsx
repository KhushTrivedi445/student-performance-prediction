"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { PageTransition } from "@/components/page-transition";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!agreed) {
      newErrors.agreed = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const success = await signUp(name, email, password);

      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to EduPredict. Redirecting to dashboard...",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Sign up failed",
          description: "Please check your details and try again.",
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
                Create your account
              </h1>
              <p className="mt-2 text-muted-foreground">
                Start predicting your academic success today
              </p>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`rounded-xl ${errors.name ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

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
                  <Label htmlFor="password">Password</Label>
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

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    disabled={isLoading}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground"
                    >
                      I agree to the{" "}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="text-primary underline hover:no-underline"
                          >
                            Terms & Conditions
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Terms & Conditions</DialogTitle>
                          </DialogHeader>
                          <div className="prose prose-sm max-w-none text-muted-foreground">
                            <h3 className="text-foreground">1. Acceptance of Terms</h3>
                            <p>
                              By accessing and using EduPredict, you accept and
                              agree to be bound by the terms and provision of
                              this agreement.
                            </p>

                            <h3 className="text-foreground">2. Use License</h3>
                            <p>
                              Permission is granted to temporarily use
                              EduPredict for personal, non-commercial
                              educational purposes. This is the grant of a
                              license, not a transfer of title.
                            </p>

                            <h3 className="text-foreground">3. Disclaimer</h3>
                            <p>
                              The predictions provided by EduPredict are based
                              on machine learning models and historical data.
                              They are intended for informational purposes only
                              and should not be considered as guaranteed
                              outcomes.
                            </p>

                            <h3 className="text-foreground">4. Privacy</h3>
                            <p>
                              Your privacy is important to us. All personal
                              information collected is used solely for providing
                              predictions and improving our services. We do not
                              sell or share your data with third parties.
                            </p>

                            <h3 className="text-foreground">5. Data Accuracy</h3>
                            <p>
                              You agree to provide accurate and truthful
                              information when using our prediction services.
                              Inaccurate data may lead to unreliable
                              predictions.
                            </p>

                            <h3 className="text-foreground">6. Limitations</h3>
                            <p>
                              EduPredict shall not be held liable for any
                              indirect, incidental, special, consequential, or
                              punitive damages resulting from your use of the
                              service.
                            </p>

                            <h3 className="text-foreground">7. Changes to Terms</h3>
                            <p>
                              We reserve the right to modify these terms at any
                              time. Continued use of the service after changes
                              constitutes acceptance of the modified terms.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </label>
                    {errors.agreed && (
                      <p className="text-sm text-destructive">{errors.agreed}</p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading || !agreed}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
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

              {/* Sign In Link */}
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-primary hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );


  
}
