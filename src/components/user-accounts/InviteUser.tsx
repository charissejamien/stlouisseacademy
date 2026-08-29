"use client"

import { useState } from "react"
import { z } from "zod"
import toast from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { inviteUserByEmail } from "@/app/(portal)/user-accounts/actions"

const inviteUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required"),

  middleName: z
    .string()
    .trim()
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  suffix: z
    .string()
    .trim()
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  role: z
    .string()
    .min(1, "Role is required"),
})

type InviteUserForm = z.infer<
  typeof inviteUserSchema
>

const roles = [
  {
    value: "parent",
    label: "Parent",
  },
  {
    value: "teacher",
    label: "Teacher",
  },
  {
    value: "staff",
    label: "Staff",
  },
  {
    value: "registrar",
    label: "Registrar",
  },
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "executive",
    label: "Executive",
  },
]

const suffixes = [
  "Sr.",
  "Jr.",
  "II",
  "III",
  "IV",
  "V",
]

export default function InviteUser() {
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState<InviteUserForm>({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    role: "",
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof InviteUserForm, string>>
  >({})

  const inviteUser = useMutation({
    mutationFn: (data: InviteUserForm) =>
      inviteUserByEmail(data),

    onSuccess: () => {
      toast.success(
        "User successfully invited by email!"
      )

      setForm({
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        email: "",
        role: "",
      })

      setErrors({})
      setOpen(false)
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateField = (
    field: keyof InviteUserForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }

  const handleSubmit = () => {
    const result =
      inviteUserSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof InviteUserForm, string>
      > = {}

      result.error.issues.forEach((issue) => {
        const field =
          issue.path[0] as keyof InviteUserForm

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})
    inviteUser.mutate(result.data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Invite User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Invite a User
          </DialogTitle>

          <DialogDescription>
            Enter the user&apos;s information and
            assign their role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* First Name + Middle Name */}
          <div className="grid grid-cols-[3fr_2fr] gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">
                First Name
              </Label>

              <Input
                id="first-name"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  updateField(
                    "firstName",
                    e.target.value
                  )
                }
              />

              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="middle-name">
                Middle Name
                <span className="ml-1 text-muted-foreground">
                  (optional)
                </span>
              </Label>

              <Input
                id="middle-name"
                placeholder="Middle name"
                value={form.middleName}
                onChange={(e) =>
                  updateField(
                    "middleName",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Last Name + Suffix */}
          <div className="grid grid-cols-[3fr_2fr] gap-4">
            <div className="space-y-2">
              <Label htmlFor="last-name">
                Last Name
              </Label>

              <Input
                id="last-name"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  updateField(
                    "lastName",
                    e.target.value
                  )
                }
              />

              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="suffix">
                Suffix
                <span className="ml-1 text-muted-foreground">
                  (optional)
                </span>
              </Label>

              <Select
                value={form.suffix}
                onValueChange={(value) =>
                  updateField("suffix", value)
                }
              >
                <SelectTrigger id="suffix" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>

                <SelectContent>
                  {suffixes.map((suffix) => (
                    <SelectItem
                      key={suffix}
                      value={suffix}
                    >
                      {suffix}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Email + Role */}
          <div className="grid grid-cols-[3fr_2fr] gap-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">
                Email
              </Label>

              <Input
                id="invite-email"
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value
                  )
                }
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role">
                Role
              </Label>

              <Select
                value={form.role}
                onValueChange={(value) =>
                  updateField("role", value)
                }
              >
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={inviteUser.isPending}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={inviteUser.isPending}
          >
            {inviteUser.isPending
              ? "Sending..."
              : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
