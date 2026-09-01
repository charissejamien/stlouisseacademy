"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { signInWithPassword } from "./actions";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithPassword(email.trim(), password);

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");

      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-10 md:mt-30 gap-6 md:gap-10 px-4 font-sans antialiased text-slate-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
        <Image
          src="/logo.svg"
          alt="St. Louisse Academy Logo"
          width={80}
          height={80}
          className="w-16 h-16 md:w-20 md:h-20 object-contain"
          priority
        />
        <div>
          <h1 className="text-sla-blue font-extrabold text-2xl md:text-[32px] tracking-[4px] leading-tight">
            ST LOUISSE ACADEMY
          </h1>
          <h2 className="text-sla-gold font-medium text-base md:text-[20px] tracking-[6px] md:tracking-[10px] uppercase mt-0.5">
            DAANBANTAYAN
          </h2>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-md flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-[450px] md:max-w-[850px] shadow-sm border border-slate-100">
        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-[200px] md:h-[380px] rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
          <Image
            src="/login-bg.svg"
            alt="Login illustration"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 flex flex-col gap-5 justify-center">
          {/* Email */}
          <div className="space-y-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="space-y-3">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pr-12"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="button"
            disabled={loading}
            onClick={handleLogin}
            className="w-full bg-sla-blue hover:bg-sla-blue/85 text-white cursor-pointer"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </div>
    </div>
  );
}
