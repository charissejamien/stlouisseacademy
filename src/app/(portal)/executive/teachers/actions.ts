"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface EmployeeDataInput {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  contact_number: string;
  gender: string;
  date_of_birth: string;
  sss_number?: string | null;
  philhealth_number?: string | null;
  pagibig_number?: string | null;
  tin_number?: string | null;
}

export interface AssignmentDataInput {
  role_title: string;
  department: string;
  contract_start_year: string; // Captured as "YYYY" string from UI
  contract_end_year: string;   // Captured as "YYYY" string from UI
  employment_status: string;
}

export interface OnboardEmployeePayload {
  employeeData: EmployeeDataInput;
  assignmentData: AssignmentDataInput;
}

export interface EmployeeAssignment {
  role_title: string | null;
  department: string | null;
  employment_status: string | null;
}

export interface EmployeeRegistryRow {
  id: string;
  employee_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  contact_number: string;
  is_active: boolean;
  employee_assignments: EmployeeAssignment[] | null;
}

export interface OnboardResponse {
  success: boolean;
  employee_id: string;
}

export async function generateEmployeeId(startYearPrefix: string): Promise<string> {
  const supabase = await createClient();
  const fullPrefix = `E${startYearPrefix}`;

  // 1. Search for the highest ID matching 'E2026%'
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
    const latestId = data[0].employee_id; // e.g., "E2026001"
    
    // 2. Extract the 3-digit sequence suffix after 'E2026' (index 5 onwards)
    const latestSequenceNumber = parseInt(latestId.slice(5), 10);
    if (!isNaN(latestSequenceNumber)) {
      nextSequence = latestSequenceNumber + 1;
    }
  }

  // 3. Pad out to exactly three digits
  const paddedSequence = String(nextSequence).padStart(3, "0");
  return `${fullPrefix}${paddedSequence}`;
}

export async function getEmployeesDirectory(): Promise<EmployeeRegistryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .select(`
      id, employee_id, first_name, middle_name, last_name, email, contact_number, is_active,
      employee_assignments(role_title, department, employment_status)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Directory query failure: ${error.message}`);
  }

  return (data as unknown as EmployeeRegistryRow[]) || [];
}

export async function onboardEmployee(payload: OnboardEmployeePayload): Promise<OnboardResponse> {
  const supabase = await createClient();
  const timestampNow = new Date().toISOString();

  const { data: activeSY, error: syError } = await supabase
    .from("school_years")
    .select("id, start_year")
    .eq("is_active", true)
    .single();

  if (syError || !activeSY) {
    throw new Error("Unable to complete registration. No active school year structure detected.");
  }

    const yearPrefix = activeSY.start_year.toString();
    const uniqueEmployeeIdStr = await generateEmployeeId(yearPrefix);

    const sanitizeValue = (val?: string | null) => (val && val.trim() !== "" ? val : null);

    // ✅ FIX: Transform pure year strings into valid calendar year boundaries for PostgreSQL DATE types
    const dbContractStartDate = `${payload.assignmentData.contract_start_year}-01-01`; // January 1st
    const dbContractEndDate = `${payload.assignmentData.contract_end_year}-12-31`;   // December 31st

    // Calculate dynamic contract length automatically in months
    const startYearNum = parseInt(payload.assignmentData.contract_start_year, 10);
    const endYearNum = parseInt(payload.assignmentData.contract_end_year, 10);
    const calculatedMonths = (endYearNum - startYearNum + 1) * 12;

    // 2. Insert into the primary employees table
    const { data: newEmployee, error: employeeError } = await supabase
    .from("employees")
    .insert({
        employee_id: uniqueEmployeeIdStr,
        first_name: payload.employeeData.first_name,
        middle_name: sanitizeValue(payload.employeeData.middle_name),
        last_name: payload.employeeData.last_name,
        email: payload.employeeData.email,
        contact_number: payload.employeeData.contact_number,
        gender: payload.employeeData.gender,
        date_of_birth: payload.employeeData.date_of_birth,
        sss_number: sanitizeValue(payload.employeeData.sss_number),
        philhealth_number: sanitizeValue(payload.employeeData.philhealth_number),
        pagibig_number: sanitizeValue(payload.employeeData.pagibig_number),
        tin_number: sanitizeValue(payload.employeeData.tin_number),
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
    role_title: payload.assignmentData.role_title,
    department: payload.assignmentData.department,
    contract_start_date: dbContractStartDate, // ✅ Now valid: "2026-01-01"
    contract_end_date: dbContractEndDate,     // ✅ Now valid: "2027-12-31"
    contract_length_months: calculatedMonths,
    employment_status: payload.assignmentData.employment_status,
    assigned_at: timestampNow,
  });

    if (assignmentError) {
    throw new Error(`Employee role assignment generation failed: ${assignmentError.message}`);
    }

  revalidatePath("/employees");
  return { success: true, employee_id: uniqueEmployeeIdStr };
}