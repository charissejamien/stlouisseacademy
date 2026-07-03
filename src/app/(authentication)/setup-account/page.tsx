"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { finalizeAccountSetup } from "../actions";

function SetupAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handlePasswordSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await finalizeAccountSetup(emailParam, password);

      if (response.success) {
        toast.success("Your account is ready! Please log in.");
        router.push("/login");
        router.refresh();
      }
    } catch {
      toast.error("Unable to activate your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-10 md:mt-30 gap-6 md:gap-10 font-sans antialiased text-slate-700 px-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
        <div>
          <img src="/logo.svg" alt="St. Louis Academy Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
        </div>

        <div>
          <h1 className="text-sla-blue font-extrabold text-2xl md:text-[32px] tracking-[4px] leading-tight">
            ST LOUISSE ACADEMY
          </h1>
          <h2 className="text-sla-gold font-medium text-base md:text-[20px] tracking-[6px] md:tracking-[10px] uppercase mt-0.5">
            DAANBANTAYAN
          </h2>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 md:pr-0 rounded-md flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-[450px] md:max-w-[850px] shadow-sm border border-slate-100">
        <div
          className="w-full md:w-[50%] py-10 px-5 rounded-md flex flex-col justify-between min-h-[200px] md:min-h-[380px] gap-20 md:gap-50 bg-cover bg-center text-white relative"
          style={{ backgroundImage: `url('/login-bg.svg')` }}
        >
          <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply rounded-md z-0"></div>

          <div className="relative z-10 space-y-2">
            <p className="text-white text-2xl md:text-[32px] font-semibold leading-tight">
              Account Setup.
            </p>

            <p className="text-white text-xs md:text-[14px] leading-relaxed font-light opacity-90">
              Set up your password to activate your school portal account.
            </p>
          </div>

          <span className="text-[10px] text-white/60 tracking-wider relative z-10 uppercase font-medium mt-4 md:mt-0">
            Secure Account Activation
          </span>
        </div>

        <div className="w-full md:w-[40%] md:px-5 flex flex-col justify-center bg-white">
          <form onSubmit={handlePasswordSubmission} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-gray-muted font-light text-[13px]">
                Email
              </label>

              <input
                type="text"
                value={emailParam}
                disabled
                className="border border-[#D9D9D9] bg-slate-50 text-slate-400 rounded-sm outline-none p-2 w-full cursor-not-allowed select-none text-[14px]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-gray-muted font-light text-[13px]">
                Choose Password *
              </label>

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  disabled={isSubmitting}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border border-[#D9D9D9] bg-white rounded-sm outline-none p-2 pr-10 w-full disabled:bg-slate-50 text-[14px] text-slate-900 placeholder:text-slate-300"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="h-[84px] flex flex-col justify-start">
              <label className="block text-gray-muted font-light text-[13px] mb-1">
                Confirm Password *
              </label>

              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  disabled={isSubmitting}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`border text-[14px] bg-white rounded-sm outline-none p-2 pr-10 w-full transition-colors disabled:bg-slate-50 text-slate-900 placeholder:text-slate-300 ${
                    passwordsDoNotMatch
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/10"
                      : "border-[#D9D9D9] focus:border-slate-400"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="h-4 mt-1">
                {passwordsDoNotMatch && (
                  <p className="text-rose-600 text-[12px] font-medium tracking-tight">
                    Passwords do not match.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-[14px] text-white w-full p-2 rounded-sm font-semibold tracking-wider transition-all flex items-center justify-center ${
                  isSubmitting
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#5474F5] to-[#304BB8] hover:opacity-95 active:scale-[0.99] shadow-sm shadow-blue-500/10"
                }`}
              >
                {isSubmitting ? (
                  <svg
                    className="h-5 w-5 animate-spin"
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
                      d="M4 12a8 8 0 018-8V4a8 8 0 00-8 8z"
                    />
                  </svg>
                ) : (
                  "Activate Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SetupAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center text-sm text-slate-500">
          Loading...
        </div>
      }
    >
      <SetupAccountForm />
    </Suspense>
  );
}