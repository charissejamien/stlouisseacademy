"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { login, sendPasswordOTP, verifyOTPAndResetPassword } from "../actions";

type ViewState = "login" | "request-otp" | "verify-otp";

export default function Login() {
  const router = useRouter();
  
  // State management vectors
  const [viewState, setViewState] = useState<ViewState>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cached input hooks for the secondary verification submission
  const [emailInput, setEmailInput] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Baseline Form Router Handler Checkpoint
  async function handleFormAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (viewState === "login") {
        const formData = new FormData(event.currentTarget);
        const response = await login(formData);
        if (response.success) {
          toast.success("Welcome back!");
          router.push("/ops/employees");
          router.refresh();
        }
      } 
      
      else if (viewState === "request-otp") {
        const response = await sendPasswordOTP(emailInput);
        if (response.success) {
          toast.success("Verification code dispatched to your inbox!");
          setViewState("verify-otp");
        }
      } 
      
      else if (viewState === "verify-otp") {
        const response = await verifyOTPAndResetPassword(emailInput, otpToken, newPassword);
        if (response.success) {
          toast.success("Password updated successfully! You can now log in.");
          setViewState("login");
          setOtpToken("");
          setNewPassword("");
        }
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "An authentication processing anomaly occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-center mt-10 md:mt-30 gap-6 md:gap-10 px-4 font-sans antialiased text-slate-700">
      
      {/* Academy Institutional Header Block */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
        <img src="/logo.svg" alt="St. Louis Academy Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
        <div>
          <h1 className="text-sla-blue font-extrabold text-2xl md:text-[32px] tracking-[4px] leading-tight">ST LOUISSE ACADEMY</h1>
          <h2 className="text-sla-gold font-medium text-base md:text-[20px] tracking-[6px] md:tracking-[10px] uppercase mt-0.5">DAANBANTAYAN</h2>
        </div>
      </div>

      {/* Main Framework Container Box */}
      <div className="bg-white p-6 md:p-10 md:pr-0 rounded-md flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-[450px] md:max-w-[850px] shadow-sm border border-slate-100">
        
        {/* Left Decorative Welcome Sidebar */}
        <div
          className="w-full md:w-[50%] py-10 px-5 rounded-md flex flex-col justify-between min-h-[200px] md:min-h-[380px] gap-20 md:gap-50 bg-cover bg-center text-white relative"
          style={{ backgroundImage: `url('/login-bg.svg')` }}
        >
          <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply rounded-md z-0"></div>
          
          <div className="relative z-10 space-y-2">
            <p className="text-white text-2xl md:text-[32px] font-semibold leading-tight">
              {viewState === "login" && "Welcome."}
              {viewState === "request-otp" && "Recovery."}
              {viewState === "verify-otp" && "Reset."}
            </p>
            <p className="text-white text-xs md:text-[14px] leading-relaxed font-light opacity-90">
              {viewState === "login" && "Stay connected with your child's academic journey and school updates"}
              {viewState === "request-otp" && "Enter your registered portal account identity email to request a 6-digit secure validation key."}
              {viewState === "verify-otp" && "Enter the verification string delivered to your device along with your fresh access password."}
            </p>
          </div>
        </div>

        {/* Right Form Interactive Viewport Layout */}
        <div className="w-full md:w-[40%] md:px-5 flex flex-col justify-center bg-white">
          <form onSubmit={handleFormAction} className="space-y-4">
            
            {/* VIEW STEP 1: STANDARD CREDENTIALS CHECKPOINT */}
            {viewState === "login" && (
              <>
                <div>
                  <label htmlFor="email" className="text-sm text-gray-muted block font-light">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    className="text-sm mt-2 border border-[#D9D9D9] bg-white rounded-sm outline-none p-2 w-full disabled:bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm text-gray-muted block font-light">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    disabled={isSubmitting}
                    className="text-sm mt-2 border border-[#D9D9D9] bg-white rounded-sm outline-none p-2 w-full disabled:bg-slate-50 text-slate-900"
                  />
                </div>
                <p 
                  onClick={() => setViewState("request-otp")}
                  className="text-[#3153DE] text-[12px] mt-2 mb-6 text-right cursor-pointer hover:underline select-none"
                >
                  Forgot Password
                </p>
              </>
            )}

            {/* VIEW STEP 2: EMAIL TARGET REQUEST FOR DISPATCHING OTP */}
            {viewState === "request-otp" && (
              <>
                <div>
                  <label className="text-sm text-gray-muted block font-light">Account Email Address</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    disabled={isSubmitting}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@school.edu.ph"
                    className="text-sm mt-2 border border-[#D9D9D9] bg-white rounded-sm outline-none p-2 w-full disabled:bg-slate-50 text-slate-900"
                  />
                </div>
                <p 
                  onClick={() => setViewState("login")}
                  className="text-[#3153DE] text-[12px] mt-2 mb-6 cursor-pointer hover:underline inline-block select-none"
                >
                  ← Back to Login
                </p>
              </>
            )}

            {/* VIEW STEP 3: OTP AND NEW PASSWORD COMMIT SYSTEM */}
            {viewState === "verify-otp" && (
              <>
                <div>
                  <label className="text-sm text-gray-muted block font-light">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpToken}
                    disabled={isSubmitting}
                    onChange={(e) => setOtpToken(e.target.value)}
                    placeholder="123456"
                    className="text-sm mt-2 border border-[#D9D9D9] bg-white rounded-sm outline-none p-2 w-full tracking-[8px] text-center font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-muted block font-light">Create New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    disabled={isSubmitting}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-sm mt-2 border border-[#D9D9D9] bg-white rounded-sm outline-none p-2 w-full text-slate-900"
                  />
                </div>
                <p 
                  onClick={() => setViewState("request-otp")}
                  className="text-[#3153DE] text-[12px] mt-2 mb-6 cursor-pointer hover:underline inline-block select-none"
                >
                  ← Resend Code
                </p>
              </>
            )}

            {/* DYNAMIC ACTION BUTTON MATRIX */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-2 rounded-sm font-semibold tracking-wider transition-all flex items-center justify-center min-h-[38px] ${
                isSubmitting
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#5474F5] to-[#304BB8] hover:opacity-95 active:scale-[0.99]"
              } text-white`}
            >
              {isSubmitting ? (
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a8 8 0 00-8 8z" />
                </svg>
              ) : (
                <>
                  {viewState === "login" && "Login"}
                  {viewState === "request-otp" && "Request Code"}
                  {viewState === "verify-otp" && "Reset Password"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}