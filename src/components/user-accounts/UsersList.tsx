"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { useState } from "react"
import toast from "react-hot-toast"

import {
  listUsers,
  disableUser,
  enableUser,
} from "@/app/(portal)/user-accounts/actions"

type RoleFilter =
  | "all"
  | "parents"
  | "teachers"
  | "employees"

export default function UsersList() {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("all")

  const [confirmAction, setConfirmAction] = useState<{
    userId: string
    action: "disable" | "enable"
  } | null>(null)

  const users = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
  })

  const disableUserMutation = useMutation({
    mutationFn: (userId: string) =>
      disableUser(userId),

    onSuccess: () => {
      toast.success("User disabled successfully")

      queryClient.invalidateQueries({
        queryKey: ["users"],
      })
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  const enableUserMutation = useMutation({
    mutationFn: (userId: string) =>
      enableUser(userId),

    onSuccess: () => {
      toast.success("User enabled successfully")

      queryClient.invalidateQueries({
        queryKey: ["users"],
      })
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isActionPending =
    disableUserMutation.isPending ||
    enableUserMutation.isPending

  const filteredUsers = users.data?.filter((u) => {
    const fullName = [
      u.first_name,
      u.middle_name,
      u.last_name,
    ]
      .filter(Boolean)
      .join(" ")

    const searchValue = search
      .toLowerCase()
      .trim()

    const matchesSearch =
      !searchValue ||
      fullName
        .toLowerCase()
        .includes(searchValue) ||
      u.email
        ?.toLowerCase()
        .includes(searchValue)

    const role = u.role?.toLowerCase()

    let matchesRole = true

    if (roleFilter === "parents") {
      matchesRole = role === "parent"
    }

    if (roleFilter === "teachers") {
      matchesRole = role === "teacher"
    }

    if (roleFilter === "employees") {
      matchesRole =
        role !== "parent" &&
        role !== "teacher"
    }

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="sm:w-80"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            variant={
              roleFilter === "all"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setRoleFilter("all")
            }
          >
            All
          </Button>

          <Button
            variant={
              roleFilter === "parents"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setRoleFilter("parents")
            }
          >
            Parents
          </Button>

          <Button
            variant={
              roleFilter === "teachers"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setRoleFilter("teachers")
            }
          >
            Teachers
          </Button>

          <Button
            variant={
              roleFilter === "employees"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setRoleFilter("employees")
            }
          >
            Employees
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Full Name
              </TableHead>

              <TableHead>
                Email
              </TableHead>

              <TableHead>
                Role
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Last Signed In
              </TableHead>

              <TableHead>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers?.map((u) => {
              const status = u.banned_until
                ? "Banned"
                : u.last_sign_in_at
                  ? "Active"
                  : "Unactive"

              return (
                <TableRow key={u.id}>
                  <TableCell>
                    {[
                      u.first_name,
                      u.middle_name,
                      u.last_name,
                      u.suffix,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>

                  <TableCell>
                    {u.email}
                  </TableCell>

                  <TableCell>
                    {u.role}
                  </TableCell>

                  <TableCell>
                    {status}
                  </TableCell>

                  <TableCell>
                    {u.last_sign_in_at
                      ? new Intl.DateTimeFormat(
                          "en-US",
                          {
                            dateStyle:
                              "medium",
                            timeStyle:
                              "short",
                          }
                        ).format(
                          new Date(
                            u.last_sign_in_at
                          )
                        )
                      : "Never"}
                  </TableCell>

                  <TableCell>
                    {u.banned_until ? (
                      <Button
                        variant="outline"
                        onClick={() =>
                          setConfirmAction({
                            userId: u.id,
                            action: "enable",
                          })
                        }
                        disabled={
                          isActionPending
                        }
                      >
                        Enable
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() =>
                          setConfirmAction({
                            userId: u.id,
                            action: "disable",
                          })
                        }
                        disabled={
                          isActionPending
                        }
                      >
                        Disable
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}

            {filteredUsers?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enable / Disable Confirmation */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => {
          if (
            !open &&
            !isActionPending
          ) {
            setConfirmAction(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.action ===
              "disable"
                ? "Disable this user?"
                : "Enable this user?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {confirmAction?.action ===
              "disable"
                ? "This user will no longer be able to access their account until they are enabled again."
                : "This user will be able to access their account again."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isActionPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isActionPending}
              onClick={(e) => {
                e.preventDefault()

                if (!confirmAction) {
                  return
                }

                if (
                  confirmAction.action ===
                  "disable"
                ) {
                  disableUserMutation.mutate(
                    confirmAction.userId,
                    {
                      onSettled: () => {
                        setConfirmAction(
                          null
                        )
                      },
                    }
                  )
                } else {
                  enableUserMutation.mutate(
                    confirmAction.userId,
                    {
                      onSettled: () => {
                        setConfirmAction(
                          null
                        )
                      },
                    }
                  )
                }
              }}
            >
              {isActionPending
                ? "Processing..."
                : confirmAction?.action ===
                    "disable"
                  ? "Disable User"
                  : "Enable User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
