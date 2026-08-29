"use client"

import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Skeleton } from "@/components/ui/skeleton"

import { getEmployees } from "@/app/(portal)/employees/actions"

export default function EmployeesList() {
  const router = useRouter()

  const {
    data: employees,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  })

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-52" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md border p-4 text-sm text-destructive">
        Failed to load employees:{" "}
        {error.message}
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption>
          A list of your employees.
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No employees found.
              </TableCell>
            </TableRow>
          ) : (
            employees?.map((employee) => {
              const user = employee.user

              const middleInitial =
                user?.middle_name
                  ? `${user.middle_name.charAt(0)}.`
                  : ""

              return (
                <TableRow
                  key={employee.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    router.push(
                      `/employees/${employee.id}`
                    )
                  }
                >
                  <TableCell className="font-medium">
                    {user
                      ? `${user.last_name}, ${user.first_name}${
                          middleInitial
                            ? ` ${middleInitial}`
                            : ""
                        }`
                      : "—"}
                  </TableCell>

                  <TableCell>
                    {employee.email}
                  </TableCell>

                  <TableCell>
                    {employee.contact_number}
                  </TableCell>

                  <TableCell>
                    {employee.employee_id}
                  </TableCell>

                  <TableCell className="capitalize">
                    {user?.role ?? "—"}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
