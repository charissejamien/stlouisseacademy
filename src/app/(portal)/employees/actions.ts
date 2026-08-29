"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

type InviteEmployeeData = {
  firstName: string
  middleName?: string
  lastName: string
  suffix?: string
  email: string
  contactNumber: string
  gender: string
  dateOfBirth: string
  role: "teacher" | "staff"
  type: "academic" | "support"
  department:
    | "pre-elementary"
    | "elementary"
    | "junior-high-school"
    | "senior-high-school"
    | "maintenance"
  sssId?: string
  philhealth?: string
  pagIbig?: string
  tinNumber?: string
}

export async function inviteEmployee(
  data: InviteEmployeeData
) {
  const {
    firstName,
    middleName,
    lastName,
    suffix,
    email,
    contactNumber,
    gender,
    dateOfBirth,
    role,
    sssId,
    philhealth,
    pagIbig,
    tinNumber,
  } = data

  // 1. Invite user through Supabase Auth
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm`,
      }
    )

  if (authError) {
    throw new Error(authError.message)
  }

  if (!authData.user) {
    throw new Error(
      "Unable to create the invited user."
    )
  }

  const userId = authData.user.id

  // 2. Create base users record
  const { error: userError } =
    await supabaseAdmin
      .from("users")
      .insert({
        id: userId,
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName,
        suffix: suffix || null,
        role,
      })

  if (userError) {
    throw new Error(userError.message)
  }

  // 3. Generate employee ID
  const currentYear = new Date()
    .getFullYear()
    .toString()

  const employeeIdPrefix = `${currentYear}1`

  const { data: existingEmployees, error: employeeFetchError } =
    await supabaseAdmin
      .from("employees")
      .select("employee_id")
      .like(
        "employee_id",
        `${employeeIdPrefix}%`
      )
      .order("employee_id", {
        ascending: false,
      })
      .limit(1)

  if (employeeFetchError) {
    throw new Error(
      employeeFetchError.message
    )
  }

  let nextNumber = 1

  if (
    existingEmployees &&
    existingEmployees.length > 0
  ) {
    const lastEmployeeId =
      existingEmployees[0].employee_id

    const lastNumber = parseInt(
      lastEmployeeId.slice(-4),
      10
    )

    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1
    }
  }

  const employeeId =
    `${employeeIdPrefix}${nextNumber
      .toString()
      .padStart(4, "0")}`

  // 4. Create employee-specific record
  const { error: employeeError } =
    await supabaseAdmin
      .from("employees")
      .insert({
        id: userId,
        employee_id: employeeId,
        email,
        contact_number: contactNumber,
        gender,
        date_of_birth: dateOfBirth,
        sss_number: sssId || null,
        philhealth_number: philhealth || null,
        pagibig_number: pagIbig || null,
        tin_number: tinNumber || null,
      })

  if (employeeError) {
    throw new Error(employeeError.message)
  }

  return {
    userId,
    employeeId,
  }
}


export async function getEmployees() {
  // 1. Get employees
  const {
    data: employees,
    error: employeeError,
  } = await supabaseAdmin
    .from("employees")
    .select(`
      id,
      employee_id,
      email,
      contact_number
    `)
    .order("employee_id", {
      ascending: true,
    })

  if (employeeError) {
    throw new Error(employeeError.message)
  }

  if (!employees || employees.length === 0) {
    return []
  }

  // 2. Get corresponding users
  const userIds = employees.map(
    (employee) => employee.id
  )

  const {
    data: users,
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
    .in("id", userIds)

  if (userError) {
    throw new Error(userError.message)
  }

  // 3. Combine employees with their users
  return employees.map((employee) => {
    const user = users?.find(
      (user) => user.id === employee.id
    )

    return {
      ...employee,
      user: user ?? null,
    }
  })
}
