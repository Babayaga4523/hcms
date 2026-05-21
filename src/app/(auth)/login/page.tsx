"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/(dashboard)";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
        <p className="text-white/80 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">HCMS BNI</h1>
        <p className="text-white/70 text-sm">Human Capital Management System</p>
      </div>

      {/* Login Card */}
      <Card className="shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-1">Welcome Back</h2>
            <p className="text-sm text-[#6B7280]">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#FEE2E2] border border-[#EF4444]/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#EF4444]">Login Failed</p>
                <p className="text-sm text-[#EF4444]/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@bnifinance.co.id"
              required
              autoComplete="email"
              disabled={isLoading}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-[#6B7280] hover:text-[#1A2B6B] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#1A2B6B] focus:ring-[#1A2B6B]"
                />
                <span className="text-sm text-[#6B7280]">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#1A2B6B] hover:text-[#1A2B6B]/80 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
              leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Credentials Notice */}
          <div className="mt-6 p-4 rounded-lg bg-[#FEF9C3]/50 border border-[#F59E0B]/20">
            <p className="text-xs font-medium text-[#854D0E] mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-[#854D0E]/80">
              <p><span className="font-medium">Admin:</span> admin@bnifinance.co.id / admin123</p>
              <p><span className="font-medium">Employee:</span> joko.susilo@bnifinance.co.id / password123</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-white/50 text-xs mt-6">
        &copy; {new Date().getFullYear()} PT BNI Finance. All rights reserved.
      </p>
    </div>
  );
}

/**
 * Login page fallback shown while useSearchParams() resolves during prerendering.
 */
function LoginFallback() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-white animate-spin" />
      <p className="text-white/80 text-sm">Loading...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A2B6B] to-[#0A1628] p-4">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}