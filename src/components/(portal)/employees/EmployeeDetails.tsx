"use client"

import {
  CalendarDays,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  VenusAndMars,
} from "lucide-react"

import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

import { GetEmployeeDetails } from "@/app/(portal)/employees/[id]/actions"

import AddEmployeeContract from "@/components/(portal)/employees/AddEmployeeContract"

type EmployeeDetailsProps = {
  employeeId: string
}

export default function EmployeeDetails({
  employeeId,
}: EmployeeDetailsProps) {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () =>
      GetEmployeeDetails(employeeId),
    enabled: !!employeeId,
  })

  // ------------------------------------------
  // Loading
  // ------------------------------------------

  if (isLoading) {
    return <EmployeeDetailsSkeleton />
  }

  // ------------------------------------------
  // Error
  // ------------------------------------------

  if (isError) {
    return (
      <div className="w-[95%] mx-auto mt-20">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-700">
            Failed to load employee information.
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>
        </div>
      </div>
    )
  }

  // ------------------------------------------
  // Employee not found
  // ------------------------------------------

  if (!data) {
    return (
      <div className="w-[95%] mx-auto mt-20">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Employee not found.
          </p>
        </div>
      </div>
    )
  }

  const {
    employee,
    user,
    contracts,
  } = data

  // ------------------------------------------
  // Derived values
  // ------------------------------------------

  const fullName = [
    user.last_name,
    ", ",
    user.first_name,
    user.middle_name
      ? ` ${user.middle_name}`
      : "",
    user.suffix
      ? ` ${user.suffix}`
      : "",
  ].join("")

  /**
   * Since type, department and assignment
   * belong to contracts, use the active
   * contract for the profile metadata.
   */
  const activeContract =
    contracts.find(
      (contract) =>
        contract.status === "active"
    ) ?? contracts[0]

  return (
    <div className="w-[95%] mx-auto mt-20 space-y-5 pb-10">

      {/* ==================================================
          EMPLOYEE PROFILE
      ================================================== */}

      <section>
        <Card className="w-full py-5">
          <CardContent className="flex flex-col gap-6 md:flex-row md:gap-10">

            {/* Employee Avatar / ID */}
            <div className="flex shrink-0 flex-col items-center space-y-3">

              {/* Placeholder for profile picture */}
              <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-100/70">
                <UserCheck className="h-12 w-12 text-blue-400" />
              </div>

              <h3 className="text-sm font-bold text-slate-700">
                ID: {employee.employee_id}
              </h3>
            </div>

            {/* Employee Details */}
            <div className="flex flex-1 flex-col justify-between gap-8 pt-2 md:pt-5">

              <div>
                <p className="text-sm text-slate-500">
                  Employee Profile
                </p>

                <h2 className="text-2xl font-bold text-slate-800">
                  {fullName}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {employee.email}
                </p>
              </div>

              {/* Employee Metadata */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {/* Role */}
                <ProfileMetadata
                  icon={
                    <UserCheck className="mt-0.5 h-4 w-4 text-slate-400" />
                  }
                  label="Role"
                  value={formatRole(user.role)}
                />

                {/* Employment Type */}
                <ProfileMetadata
                  icon={
                    <GraduationCap className="mt-0.5 h-4 w-4 text-slate-400" />
                  }
                  label="Type"
                  value={
                    activeContract?.type
                      ? formatValue(
                          activeContract.type
                        )
                      : "—"
                  }
                />

                {/* Department */}
                <ProfileMetadata
                  icon={
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-400" />
                  }
                  label="Department"
                  value={
                    activeContract?.department
                      ? formatDepartment(
                          activeContract.department
                        )
                      : "—"
                  }
                />

                {/* Assignment */}
                <ProfileMetadata
                  icon={
                    <FileText className="mt-0.5 h-4 w-4 text-slate-400" />
                  }
                  label="Assignment"
                  value={
                    activeContract?.assignment ??
                    "—"
                  }
                />

              </div>
            </div>
          </CardContent>
        </Card>
      </section>


      {/* ==================================================
          BASIC + CONTACT INFORMATION
      ================================================== */}

      <section>
        <Card>
          <CardContent className="pt-5">

            <div className="mb-6">
              <h3 className="font-semibold text-slate-800">
                Employee Information
              </h3>

              <p className="text-xs text-slate-400">
                Basic personal and contact information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">

              {/* First Name */}
              <InformationItem
                icon={
                  <UserCheck className="h-3.5 w-3.5" />
                }
                label="First Name"
                value={user.first_name}
              />

              {/* Middle Name */}
              <InformationItem
                label="Middle Name"
                value={user.middle_name}
              />

              {/* Last Name */}
              <InformationItem
                label="Last Name"
                value={user.last_name}
              />

              {/* Suffix */}
              <InformationItem
                label="Suffix"
                value={user.suffix}
              />

              {/* Gender */}
              <InformationItem
                icon={
                  <VenusAndMars className="h-3.5 w-3.5" />
                }
                label="Gender"
                value={employee.gender}
                capitalize
              />

              {/* Date of Birth */}
              <InformationItem
                icon={
                  <CalendarDays className="h-3.5 w-3.5" />
                }
                label="Date of Birth"
                value={employee.date_of_birth}
              />

              {/* Email */}
              <InformationItem
                icon={
                  <Mail className="h-3.5 w-3.5" />
                }
                label="Email"
                value={employee.email}
              />

              {/* Contact */}
              <InformationItem
                icon={
                  <Phone className="h-3.5 w-3.5" />
                }
                label="Contact Number"
                value={employee.contact_number}
              />

            </div>
          </CardContent>
        </Card>
      </section>


      {/* ==================================================
          GOVERNMENT IDS + CONTRACTS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* =================================================
            GOVERNMENT IDS
        ================================================= */}

        <section>
          <Card>
            <CardContent className="pt-5">

              <div className="mb-5">
                <h3 className="font-semibold text-slate-800">
                  Government IDs
                </h3>

                <p className="text-xs text-slate-400">
                  Employee government identification numbers.
                </p>
              </div>

              <div className="flex flex-col gap-3">

                {/* SSS */}
                <GovernmentIdItem
                  label="SSS Number"
                  value={
                    employee.sss_number
                  }
                />

                {/* PhilHealth */}
                <GovernmentIdItem
                  label="PhilHealth Number"
                  value={
                    employee.philhealth_number
                  }
                />

                {/* Pag-IBIG */}
                <GovernmentIdItem
                  label="Pag-IBIG Number"
                  value={
                    employee.pagibig_number
                  }
                />

                {/* TIN */}
                <GovernmentIdItem
                  label="TIN Number"
                  value={
                    employee.tin_number
                  }
                />

              </div>
            </CardContent>
          </Card>
        </section>


        {/* =================================================
            CONTRACTS
        ================================================= */}

        <section>
          <Card>
            <CardContent className="pt-5">

              <div className="mb-5 flex items-start justify-between gap-4">

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Contracts
                  </h3>

                  <p className="text-xs text-slate-400">
                    Employment contracts and assignments.
                  </p>
                </div>

                {/* Add Contract */}
                <AddEmployeeContract
                  employeeId={employeeId}
                />

              </div>

              {contracts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center">
                  <FileText className="mx-auto mb-2 h-5 w-5 text-slate-300" />

                  <p className="text-sm text-slate-400">
                    No contracts found.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add a contract to get started.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y">

                  {contracts.map(
                    (contract) => (
                      <div
                        key={contract.id}
                        className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0"
                      >

                        {/* Contract Header */}
                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <p className="text-sm font-semibold text-slate-700">
                              {contract.assignment ||
                                "Employment Contract"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {formatDepartment(
                                contract.department
                              )}
                              {" · "}
                              {formatValue(
                                contract.type
                              )}
                            </p>

                          </div>

                          {/* Status */}
                          <span
                            className={`
                              shrink-0 rounded-full px-2.5 py-1
                              text-[10px] font-bold uppercase
                              tracking-wide
                              ${
                                contract.status ===
                                "active"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : contract.status ===
                                    "expired"
                                  ? "bg-slate-100 text-slate-500"
                                  : "bg-red-50 text-red-600"
                              }
                            `}
                          >
                            {formatStatus(
                              contract.status
                            )}
                          </span>

                        </div>


                        {/* Contract Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">

                          <ContractMetadata
                            label="Start Date"
                            value={
                              contract.start_date
                            }
                          />

                          <ContractMetadata
                            label="End Date"
                            value={
                              contract.end_date
                            }
                          />

                          <ContractMetadata
                            label="Effective Date"
                            value={
                              contract.effective_date
                            }
                          />

                        </div>


                        {/* Contract File */}
                        {contract.contract_file ? (
                          <a
                            href={
                              contract.contract_file
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline"
                          >
                            <FileText className="h-3.5 w-3.5" />

                            View Contract File
                          </a>
                        ) : (
                          <p className="text-xs text-slate-400">
                            No contract file uploaded.
                          </p>
                        )}

                      </div>
                    )
                  )}

                </div>
              )}

            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  )
}


/* ======================================================
   PROFILE METADATA
====================================================== */

function ProfileMetadata({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">

      {icon}

      <div className="min-w-0">

        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </h4>

        <p className="truncate text-sm font-semibold text-slate-700">
          {value}
        </p>

      </div>
    </div>
  )
}


/* ======================================================
   INFORMATION ITEM
====================================================== */

function InformationItem({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon?: React.ReactNode
  label: string
  value?: string | null
  capitalize?: boolean
}) {
  return (
    <div className="flex items-start gap-2.5">

      {icon && (
        <div className="mt-0.5 text-slate-400">
          {icon}
        </div>
      )}

      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p
          className={`mt-0.5 text-sm font-semibold text-slate-700 ${
            capitalize
              ? "capitalize"
              : ""
          }`}
        >
          {value || "—"}
        </p>

      </div>
    </div>
  )
}


/* ======================================================
   GOVERNMENT ID ITEM
====================================================== */

function GovernmentIdItem({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">

      <div className="flex items-center gap-2">

        <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />

        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>

      </div>

      <span className="text-xs font-semibold text-slate-700">
        {value || "—"}
      </span>

    </div>
  )
}


/* ======================================================
   CONTRACT METADATA
====================================================== */

function ContractMetadata({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-700">
        {value || "—"}
      </p>
    </div>
  )
}


/* ======================================================
   FORMATTERS
====================================================== */

function formatDepartment(
  department: string
) {
  const departments: Record<
    string,
    string
  > = {
    "pre-elementary":
      "Pre-Elementary",

    elementary:
      "Elementary",

    "junior-high-school":
      "Junior High School",

    "senior-high-school":
      "Senior High School",

    maintenance:
      "Maintenance",
  }

  return (
    departments[department] ??
    department
  )
}

function formatValue(
  value: string
) {
  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ")
}

function formatRole(
  role: string
) {
  return role
    .charAt(0)
    .toUpperCase() +
    role.slice(1)
}

function formatStatus(
  status: string
) {
  return status
    .charAt(0)
    .toUpperCase() +
    status.slice(1)
}


/* ======================================================
   SKELETON
====================================================== */

function EmployeeDetailsSkeleton() {
  return (
    <div className="w-[95%] mx-auto mt-20 space-y-5 pb-10">

      {/* Profile */}
      <Card className="py-5">
        <CardContent className="flex flex-col gap-6 md:flex-row md:gap-10">

          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-32 w-32 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="flex flex-1 flex-col gap-8 pt-5">

            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-4 w-52" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="space-y-2"
                >
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}

            </div>

          </div>
        </CardContent>
      </Card>


      {/* Employee Information */}
      <Card>
        <CardContent className="pt-5">

          <div className="mb-6 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="space-y-2"
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}

          </div>

        </CardContent>
      </Card>


      {/* Government IDs + Contracts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        <Card>
          <CardContent className="pt-5">

            <div className="mb-5 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>

            <div className="space-y-4">

              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between"
                >
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}

            </div>

          </CardContent>
        </Card>


        <Card>
          <CardContent className="pt-5">

            <div className="mb-5 flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3 w-56" />
              </div>

              <Skeleton className="h-9 w-24" />
            </div>

            <div className="space-y-5">

              {Array.from({
                length: 2,
              }).map((_, index) => (
                <div
                  key={index}
                  className="space-y-4 border-b pb-5 last:border-0"
                >
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-48" />
                    </div>

                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({
                      length: 3,
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="space-y-2"
                      >
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}
