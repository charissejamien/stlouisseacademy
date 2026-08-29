"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

type EmployeeDetailsData = {
  firstName: string
  middleName?: string
  lastName: string
  suffix?: string
  employee_id: string
  role: "teacher" | "staff"

  email: string
  contactNumber: string
  gender: string
  dateOfBirth: string

  sssId?: string
  philhealth?: string
  pagIbig?: string
  tinNumber?: string
}

type AddEmployeeContractData = {
  employeeId: string

  type: "academic" | "support"

  department:
    | "pre-elementary"
    | "elementary"
    | "junior-high-school"
    | "senior-high-school"
    | "maintenance"

  assignment: string

  status: "active" | "expired" | "terminated"

  startDate: string
  endDate?: string
  effectiveDate: string

  contractFile?: string

}

export async function GetEmployeeDetails(
  employeeId: string
) {
  // 1. Get employee
  const {
    data: employee,
    error: employeeError,
  } = await supabaseAdmin
    .from("employees")
    .select(`
      id,
      employee_id,
      email,
      contact_number,
      gender,
      date_of_birth,
      sss_number,
      philhealth_number,
      pagibig_number,
      tin_number
    `)
    .eq("id", employeeId)
    .single()

  if (employeeError) {
    throw new Error(
      `Failed to get employee: ${employeeError.message}`
    )
  }

  if (!employee) {
    throw new Error("Employee not found.")
  }

  // 2. Get user information
  const {
    data: user,
    error: userError,
  } = await supabaseAdmin
    .from("users")
    .select(`
      id,
      first_name,
      middle_name,
      last_name,
      suffix,
      role
    `)
    .eq("id", employee.id)
    .single()

  if (userError) {
    throw new Error(
      `Failed to get employee profile: ${userError.message}`
    )
  }

  // 3. Get contracts
  const {
    data: contracts,
    error: contractsError,
  } = await supabaseAdmin
    .from("contracts")
    .select(`
      id,
      type,
      department,
      assignment,
      status,
      start_date,
      end_date,
      effective_date,
      contract_file,
      created_at,
      created_by,
      updated_at,
      updated_by
    `)
    .eq("employee_id", employeeId)
    .order("created_at", {
      ascending: false,
    })

  if (contractsError) {
    throw new Error(
      `Failed to get employee contracts: ${contractsError.message}`
    )
  }

  return {
    employee,
    user,
    contracts: contracts ?? [],
  }
}

export async function UpdateEmployeeDetails(
  employeeId: string,
  data: EmployeeDetailsData
) {
  const {
    firstName,
    middleName,
    lastName,
    suffix,
    role,
    email,
    contactNumber,
    gender,
    dateOfBirth,
    sssId,
    philhealth,
    pagIbig,
    tinNumber,
  } = data

  // 1. Update users table
  const {
    error: userError,
  } = await supabaseAdmin
    .from("users")
    .update({
      first_name: firstName,
      middle_name: middleName || null,
      last_name: lastName,
      suffix: suffix || null,
      role,
    })
    .eq("id", employeeId)

  if (userError) {
    throw new Error(
      `Failed to update employee profile: ${userError.message}`
    )
  }

  // 2. Update employees table
  const {
    error: employeeError,
  } = await supabaseAdmin
    .from("employees")
    .update({
      email,
      contact_number: contactNumber,
      gender,
      date_of_birth: dateOfBirth,
      sss_number: sssId || null,
      philhealth_number: philhealth || null,
      pagibig_number: pagIbig || null,
      tin_number: tinNumber || null,
    })
    .eq("id", employeeId)

  if (employeeError) {
    throw new Error(
      `Failed to update employee details: ${employeeError.message}`
    )
  }

  return {
    success: true,
  }
}

export async function AddEmployeeContract(
  data: AddEmployeeContractData
) {
  const {
    employeeId,
    type,
    department,
    assignment,
    status,
    startDate,
    endDate,
    effectiveDate,
    contractFile,
  } = data

  const {
    data: contract,
    error,
  } = await supabaseAdmin
    .from("contracts")
    .insert({
      employee_id: employeeId,
      type,
      department,
      assignment,
      status,
      start_date: startDate,
      end_date: endDate || null,
      effective_date: effectiveDate,
      contract_file: contractFile || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(
      `Failed to add employee contract: ${error.message}`
    )
  }

  return contract
}
