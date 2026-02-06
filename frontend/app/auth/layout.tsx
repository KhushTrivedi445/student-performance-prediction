import React from "react"
import { AuthProvider } from "@/lib/auth-context";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ScrollToTop />
      {children}
    </AuthProvider>
  );
}
