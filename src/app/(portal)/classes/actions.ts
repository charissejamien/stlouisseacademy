"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

export type GradeLevel = {
  id: string
  grade_level: string
}

export type Adviser = {
  id: string
  name: string
  employee_id: string
}

export type SectionFormData = {
  gradeLevels: GradeLevel[]
  advisers: Adviser[]
}

export async function getSectionFormData(): Promise<SectionFormData> {

  const { data: gradeLevels, error: gradeLevelError } = await supabaseAdmin
    .from("grade_levels")
    .select("id, grade_level")
    .order("grade_level")

  if (gradeLevelError) {
    throw new Error(
      `Failed to load grade levels: ${gradeLevelError.message}`
    )
  }

  const { data: contracts, error: contractError } = await supabaseAdmin
    .from("contracts")
    .select(`
      id,
      employees!inner (
        id,
        employee_id
      )
    `)
    .eq("type", "academic")
    .eq("status", "active")

  if (contractError) {
    throw new Error(
      `Failed to load advisers: ${contractError.message}`
    )
  }

  const employeeIds = contracts?.map((contract) => {
      const employee = Array.isArray(
        contract.employees
      )
        ? contract.employees[0]
        : contract.employees

      return employee?.id
    }).filter(Boolean) ?? []

  let users: {
    id: string
    first_name: string
    middle_name: string | null
    last_name: string
    suffix: string | null
  }[] = []

  if (employeeIds.length > 0) {
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select(
        "id, first_name, middle_name, last_name, suffix"
      )
      .in("id", employeeIds)

    if (userError) {
      throw new Error(
        `Failed to load adviser information: ${userError.message}`
      )
    }

    users = userData ?? []
  }

  // ------------------------------------------
  // Map Advisers
  // ------------------------------------------

  const advisers: Adviser[] =
    contracts
      ?.map((contract) => {
        const employee = Array.isArray(
          contract.employees
        )
          ? contract.employees[0]
          : contract.employees

        if (!employee) {
          return null
        }

        const user = users.find(
          (user) => user.id === employee.id
        )

        if (!user) {
          return null
        }

        const middleInitial = user.middle_name
          ? ` ${user.middle_name.charAt(0)}.`
          : ""

        const suffix = user.suffix
          ? ` ${user.suffix}`
          : ""

        return {
          id: employee.id,
          employee_id: employee.employee_id,
          name: `${user.last_name}, ${user.first_name}${middleInitial}${suffix}`,
        }
      })
      .filter(
        (adviser): adviser is Adviser =>
          adviser !== null
      ) ?? []

  return {
    gradeLevels: gradeLevels ?? [],
    advisers,
  }
}

// ==================================================
// ADD SECTION
// ==================================================

export type AddSectionData = {
  gradeLevelId: string

  // Optional because some grade levels
  // may not have named sections.
  sectionName?: string

  sectionCode?: string
  adviserId?: string
  classSize?: number
}

export async function addSection(
  data: AddSectionData
) {
  const {
    gradeLevelId,
    sectionName,
    sectionCode,
    adviserId,
    classSize,
  } = data

  // ------------------------------------------
  // Get Active School Year
  // ------------------------------------------

  const {
    data: schoolYear,
    error: schoolYearError,
  } = await supabaseAdmin
    .from("school_years")
    .select("id")
    .eq("is_active", true)
    .single()

  if (schoolYearError) {
    throw new Error(
      `Failed to get active school year: ${schoolYearError.message}`
    )
  }

  if (!schoolYear) {
    throw new Error(
      "No active school year was found."
    )
  }

  // ------------------------------------------
  // Verify Grade Level Exists
  // ------------------------------------------

  const {
    data: gradeLevel,
    error: gradeLevelError,
  } = await supabaseAdmin
    .from("grade_levels")
    .select("id")
    .eq("id", gradeLevelId)
    .single()

  if (gradeLevelError || !gradeLevel) {
    throw new Error(
      "The selected grade level does not exist."
    )
  }

  // ------------------------------------------
  // Optional Adviser Validation
  // ------------------------------------------

  if (adviserId) {
    const {
      data: adviserContract,
      error: adviserError,
    } = await supabaseAdmin
      .from("contracts")
      .select("id")
      .eq("id", adviserId)
      .eq("type", "academic")
      .eq("status", "active")
      .maybeSingle()

    if (adviserError) {
      throw new Error(
        `Failed to validate adviser: ${adviserError.message}`
      )
    }

    if (!adviserContract) {
      throw new Error(
        "The selected adviser is not an active academic employee."
      )
    }
  }

  // ------------------------------------------
  // Create Section
  // ------------------------------------------

  const {
    data: section,
    error: sectionError,
  } = await supabaseAdmin
    .from("sections")
    .insert({
      grade_level: gradeLevelId,
      school_year: schoolYear.id,

      // NULL when no section name is provided
      section_name:
        sectionName?.trim() || null,

      section_code:
        sectionCode?.trim() || null,

      adviser_id:
        adviserId || null,

      class_size:
        classSize ?? null,
    })
    .select()
    .single()

  if (sectionError) {
    throw new Error(
      `Failed to create section: ${sectionError.message}`
    )
  }

  return section
}

// ==================================================
// GET CLASSES / SECTIONS
// ==================================================

export async function GetClasses() {
  // ------------------------------------------
  // 1. Get Active School Year
  // ------------------------------------------

  const {
    data: activeSchoolYear,
    error: schoolYearError,
  } = await supabaseAdmin
    .from("school_years")
    .select("id, start_year, end_year")
    .eq("is_active", true)
    .single()

  if (schoolYearError) {
    throw new Error(
      `Failed to get active school year: ${schoolYearError.message}`
    )
  }

  if (!activeSchoolYear) {
    throw new Error(
      "No active school year found."
    )
  }

  // ------------------------------------------
  // 2. Get Sections
  // ------------------------------------------

  const {
    data: sections,
    error: sectionsError,
  } = await supabaseAdmin
    .from("sections")
    .select(`
      id,
      grade_level,
      school_year,
      section_name,
      adviser_id,
      class_size,
      section_code
    `)
    .eq(
      "school_year",
      activeSchoolYear.id
    )
    .order("section_name", {
      ascending: true,
      nullsFirst: true,
    })

  if (sectionsError) {
    throw new Error(
      `Failed to get sections: ${sectionsError.message}`
    )
  }

  if (!sections || sections.length === 0) {
    return []
  }

  // ------------------------------------------
  // 3. Get Grade Levels
  // ------------------------------------------

  const gradeLevelIds = [
    ...new Set(
      sections
        .map(
          (section) =>
            section.grade_level
        )
        .filter(
          (id): id is string =>
            Boolean(id)
        )
    ),
  ]

  let gradeLevels: {
    id: string
    grade_level: string
  }[] = []

  if (gradeLevelIds.length > 0) {
    const {
      data: gradeLevelData,
      error: gradeLevelError,
    } = await supabaseAdmin
      .from("grade_levels")
      .select("id, grade_level")
      .in("id", gradeLevelIds)

    if (gradeLevelError) {
      throw new Error(
        `Failed to get grade levels: ${gradeLevelError.message}`
      )
    }

    gradeLevels =
      gradeLevelData ?? []
  }

  // ------------------------------------------
  // 4. Get Advisers
  // ------------------------------------------

  const adviserIds = [
    ...new Set(
      sections
        .map(
          (section) =>
            section.adviser_id
        )
        .filter(
          (id): id is string =>
            Boolean(id)
        )
    ),
  ]

  let employees: {
    id: string
    employee_id: string
  }[] = []

  let users: {
    id: string
    first_name: string
    middle_name: string | null
    last_name: string
    suffix: string | null
  }[] = []

  if (adviserIds.length > 0) {
    // ------------------------------------------
    // Employees
    // ------------------------------------------

    const {
      data: employeeData,
      error: employeeError,
    } = await supabaseAdmin
      .from("employees")
      .select(
        "id, employee_id"
      )
      .in(
        "id",
        adviserIds
      )

    if (employeeError) {
      throw new Error(
        `Failed to get advisers: ${employeeError.message}`
      )
    }

    employees =
      employeeData ?? []

    // ------------------------------------------
    // Users
    // ------------------------------------------

    const userIds =
      employees.map(
        (employee) =>
          employee.id
      )

    if (userIds.length > 0) {
      const {
        data: userData,
        error: userError,
      } = await supabaseAdmin
        .from("users")
        .select(`
          id,
          first_name,
          middle_name,
          last_name,
          suffix
        `)
        .in(
          "id",
          userIds
        )

      if (userError) {
        throw new Error(
          `Failed to get adviser information: ${userError.message}`
        )
      }

      users =
        userData ?? []
    }
  }

  // ------------------------------------------
  // 5. Map Everything Together
  // ------------------------------------------

  return sections.map(
    (section) => {
      // ----------------------------------------
      // Grade Level
      // ----------------------------------------

      const gradeLevel =
        gradeLevels.find(
          (grade) =>
            grade.id ===
            section.grade_level
        )

      // ----------------------------------------
      // Adviser Employee
      // ----------------------------------------

      const employee =
        employees.find(
          (employee) =>
            employee.id ===
            section.adviser_id
        )

      // ----------------------------------------
      // Adviser User
      // ----------------------------------------

      const user =
        users.find(
          (user) =>
            user.id ===
            section.adviser_id
        )

      // ----------------------------------------
      // Adviser Name
      // ----------------------------------------

      const adviserName = user
        ? `${user.last_name}, ${user.first_name}${
            user.middle_name
              ? ` ${user.middle_name.charAt(0)}.`
              : ""
          }${
            user.suffix
              ? ` ${user.suffix}`
              : ""
          }`
        : null

      // ----------------------------------------
      // Return Formatted Class
      // ----------------------------------------

      return {
        id: section.id,

        // Actual grade level name
        gradeLevel:
          gradeLevel?.grade_level ??
          "Unknown",

        // Can be null
        section:
          section.section_name,

        sectionCode:
          section.section_code,

        adviser:
          adviserName,

        adviserEmployeeId:
          employee?.employee_id ??
          null,

        classSize:
          section.class_size,

        // Actual school year
        schoolYear:
          `${activeSchoolYear.start_year}–${activeSchoolYear.end_year}`,
      }
    }
  )
}
