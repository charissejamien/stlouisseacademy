"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* Generate Employee ID */
export async function generateEmployeeId(startYearPrefix: string): Promise<string> {
  const supabase = await createClient();
  const fullPrefix = `E${startYearPrefix}`;

  const { data, error } = await supabase
    .from("employees")
    .select("employee_id")
    .like("employee_id", `${fullPrefix}%`)
    .order("employee_id", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Failed to query latest employee sequence: ${error.message}`);
  }

  let nextSequence = 1;

  if (data && data.length > 0) {
    const latestId = data[0].employee_id;
    
    const latestSequenceNumber = parseInt(latestId.slice(5), 10);
    if (!isNaN(latestSequenceNumber)) {
      nextSequence = latestSequenceNumber + 1;
    }
  }

  const paddedSequence = String(nextSequence).padStart(3, "0");
  return `${fullPrefix}${paddedSequence}`;
}

/* Register and Send Email Invite to Employee */
export async function InviteEmployee(email: string, fullName: string, role: string) {
  const supabase = await createClient();
  const timestampNow = new Date().toISOString();

  try {
    const { data: activeSY, error: syError } = await supabase
      .from("school_years")
      .select("id, start_year")
      .eq("is_active", true)
      .single();

    if (syError || !activeSY) {
      throw new Error("Unable to complete registration. No active school year structure detected.");
    }

    const { data: existingEmp } = await supabase
      .from("employees")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingEmp) {
      throw new Error("An employee record already exists with this email address.");
    }

    const yearPrefix = activeSY.start_year.toString();
    const assignedEmployeeId = await generateEmployeeId(yearPrefix);

    // Split fullName string into name properties for database normalization
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "Staff";
    const lastName = nameParts.slice(1).join(" ") || "Member";

    // 4. Contract Calculation Logic matching your working sample data structures
    const currentYearNum = parseInt(yearPrefix, 10);
    const endYearNum = currentYearNum + 1; // Generates a standard baseline 1-year track span

    const dbContractStartDate = `${currentYearNum}-01-01`;
    const dbContractEndDate = `${endYearNum}-12-31`;
    const calculatedMonths = (endYearNum - currentYearNum + 1) * 12;

    const { data: newEmployee, error: employeeError } = await supabase
      .from("employees")
      .insert({
        employee_id: assignedEmployeeId,
        first_name: firstName,
        middle_name: null,
        last_name: lastName,
        email: email,
        is_active: true,
        created_at: timestampNow,
      })
      .select("id")
      .single();

    if (employeeError) {
      throw new Error(`Employee profile initialization rejected: ${employeeError.message}`);
    }

    const { error: assignmentError } = await supabase
      .from("employee_assignments")
      .insert({
        employee_id_uuid: newEmployee.id,
        school_year_id: activeSY.id,
        role_title: role,
        department: "Academic Faculty",
        contract_start_date: dbContractStartDate,
        contract_end_date: dbContractEndDate,
        contract_length_months: calculatedMonths,
        employment_status: "Regular Full-time",
      });

    if (assignmentError) {
      throw new Error(`Employee role assignment generation failed: ${assignmentError.message}`);
    }

    const inviteLink = `http://localhost:3000/setup-account?email=${encodeURIComponent(email)}`;
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Onboarding <onboarding@resend.dev>",
      to: ["jamiencharisse@gmail.com"],
      subject: "Action Required: Setup Your School Portal Account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-bottom: 4px;">Welcome to St. Louis School, ${fullName}!</h2>
          <p style="font-size: 14px; color: #64748b; margin-top: 0;">An operational system profile has been provisioned under your identity.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 14px; color: #334155;">Your assigned Institutional ID code is: <strong>${assignedEmployeeId}</strong>.</p>
          <p style="font-size: 14px; color: #334155;">You have been authorized the system permissions of a: <strong>${role}</strong>.</p>
          <p style="font-size: 14px; color: #334155; margin-bottom: 24px;">To claim your credentials and establish your secret portal access password, utilize the setup link below:</p>
          <a href="${inviteLink}" style="background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; display: inline-block;">
            Set Up Account
          </a>
        </div>
      `,
    });

    if (emailError) throw new Error(emailError.message);
    return { success: true, employee_id: assignedEmployeeId, emailData };

  } catch (err) {
    const error = err as Error;
    throw new Error(error.message || "Failed to complete organizational onboarding sequence.");
  }
}

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