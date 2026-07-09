"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function finalizeAccountSetup(email: string, secretKey: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: email,
    password: secretKey,
  });

  if (error) {
    throw new Error(`Authentication Engine Refusal: ${error.message}`);
  }

  return { success: true };
}

/* Login Function */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    throw new Error("Both email and password input credentials are required.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

const otpCache = new Map<string, { code: string; expiresAt: number }>();

/**
 * 📨 1. Generate & Send Custom OTP via Resend
 */
export async function sendPasswordOTP(email: string) {
  // Generate a random 6-digit number string
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiration limit for 10 minutes from now
  const expiresAt = Date.now() + 10 * 60 * 1000;
  otpCache.set(email.toLowerCase(), { code: verificationCode, expiresAt });

  try {
    const { data, error } = await resend.emails.send({
      from: "Onboarding <onboarding@resend.dev>",
      to: ["jamiencharisse@gmail.com"],
      subject: "Your Password Reset Verification Code",
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #334155;">
          <h2 style="color: #1e3a8a;">Account Security Access</h2>
          <p>You requested a password reset code for your St. Louisse Academy portal account.</p>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 6px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1e293b;">${verificationCode}</span>
          </div>
          <p style="font-size: 12px; color: #64748b;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (err) {
    const error = err as Error;
    throw new Error(`Failed to send code: ${error.message}`);
  }
}

/**
 * 🔒 2. Validate OTP Custom Token & Commit New Password String
 */
export async function verifyOTPAndResetPassword(email: string, token: string, newPassword: string) {
  const cachedData = otpCache.get(email.toLowerCase());

  if (!cachedData) {
    throw new Error("No active password reset request found for this email address.");
  }

  if (Date.now() > cachedData.expiresAt) {
    otpCache.delete(email.toLowerCase());
    throw new Error("Verification code has expired. Please request a new code.");
  }

  if (cachedData.code !== token.trim()) {
    throw new Error("Incorrect 6-digit verification code entered.");
  }

  const supabase = await createClient();

  // 1. Exchange the verified OTP token for a real, live Supabase session securely
  const { error: sessionError } = await supabase.auth.verifyOtp({
    email: email.toLowerCase(),
    token: token.trim(),
    type: "recovery", // 👈 Tells Supabase this is an account recovery session override
  });

  if (sessionError) {
    throw new Error(`Session authorization failure: ${sessionError.message}`);
  }

  // 2. Now that the user is actively logged into this server instance context, update their password row
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    throw new Error(`Failed to save your new password profile: ${updateError.message}`);
  }

  // 3. Clear the used OTP out of cache memory footprint and sign them out of the temp session
  otpCache.delete(email.toLowerCase());
  await supabase.auth.signOut(); 

  return { success: true };
}