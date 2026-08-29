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

import { inviteEmployee } from "@/app/(portal)/employees/actions"

const inviteEmployeeSchema = z.object({
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

  contactNumber: z
    .string()
    .trim()
    .min(1, "Contact number is required"),

  gender: z
    .string()
    .min(1, "Gender is required"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required"),

  role: z
    .string()
    .min(1, "Role is required"),

  type: z
    .string()
    .min(1, "Type is required"),

  department: z
    .string()
    .min(1, "Department is required"),

  sssId: z
    .string()
    .trim()
    .optional(),

  philhealth: z
    .string()
    .trim()
    .optional(),

  pagIbig: z
    .string()
    .trim()
    .optional(),

  tinNumber: z
    .string()
    .trim()
    .optional(),
})

type InviteEmployeeForm = z.infer<
  typeof inviteEmployeeSchema
>

const roles = [
  {
    value: "teacher",
    label: "Teacher",
  },
  {
    value: "staff",
    label: "Staff",
  },
]

const employmentTypes = [
  {
    value: "academic",
    label: "Academic",
  },
  {
    value: "support",
    label: "Support",
  },
]

const departments = [
  {
    value: "pre-elementary",
    label: "Pre-Elementary",
  },
  {
    value: "elementary",
    label: "Elementary",
  },
  {
    value: "junior-high-school",
    label: "Junior High School",
  },
  {
    value: "senior-high-school",
    label: "Senior High School",
  },
  {
    value: "maintenance",
    label: "Maintenance",
  },
]

const genders = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
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

const initialForm: InviteEmployeeForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  email: "",
  contactNumber: "",
  gender: "",
  dateOfBirth: "",
  role: "",
  type: "",
  department: "",
  sssId: "",
  philhealth: "",
  pagIbig: "",
  tinNumber: "",
}

export default function InviteEmployee() {
  const [open, setOpen] = useState(false)

  const [form, setForm] =
    useState<InviteEmployeeForm>(initialForm)

  const [errors, setErrors] = useState<
    Partial<Record<keyof InviteEmployeeForm, string>>
  >({})

  const inviteEmployeeMutation = useMutation({
    mutationFn: (data: InviteEmployeeForm) =>
      inviteEmployee(data),

    onSuccess: () => {
      toast.success(
        "Employee successfully invited by email!"
      )

      setForm(initialForm)
      setErrors({})
      setOpen(false)
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateField = (
    field: keyof InviteEmployeeForm,
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
      inviteEmployeeSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof InviteEmployeeForm, string>
      > = {}

      result.error.issues.forEach((issue) => {
        const field =
          issue.path[0] as keyof InviteEmployeeForm

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})

    inviteEmployeeMutation.mutate(result.data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          Invite Employee
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-5xl
          max-h-[90vh]
          overflow-y-auto
          p-4
          sm:p-6
        "
      >
        <DialogHeader>
          <DialogTitle>
            Invite an Employee
          </DialogTitle>

          <DialogDescription>
            Enter the employee&apos;s information and
            assign their employment details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2 sm:py-4">

          {/* Personal Information */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Personal Information
              </h3>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Enter the employee&apos;s basic personal information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="first-name">
                  First Name
                  <span className="ml-1 text-destructive">
                    *
                  </span>
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
                  <p className="text-xs text-destructive">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Middle Name */}
              <div className="space-y-2">
                <Label htmlFor="middle-name">
                  Middle Name
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

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="last-name">
                  Last Name
                  <span className="ml-1 text-destructive">
                    *
                  </span>
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
                  <p className="text-xs text-destructive">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Suffix */}
              <div className="space-y-2">
                <Label htmlFor="suffix">
                  Suffix
                </Label>

                <Select
                  value={form.suffix}
                  onValueChange={(value) =>
                    updateField(
                      "suffix",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    id="suffix"
                    className="w-full"
                  >
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

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Select
                  value={form.gender}
                  onValueChange={(value) =>
                    updateField(
                      "gender",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    id="gender"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>

                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem
                        key={gender.value}
                        value={gender.value}
                      >
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.gender && (
                  <p className="text-xs text-destructive">
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="date-of-birth">
                  Date of Birth
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="date-of-birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    updateField(
                      "dateOfBirth",
                      e.target.value
                    )
                  }
                />

                {errors.dateOfBirth && (
                  <p className="text-xs text-destructive">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Contact Information
              </h3>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Provide the employee&apos;s contact details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="invite-email">
                  Email
                  <span className="ml-1 text-destructive">
                    *
                  </span>
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
                  <p className="text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="contact-number">
                  Contact Number
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="contact-number"
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  value={form.contactNumber}
                  onChange={(e) =>
                    updateField(
                      "contactNumber",
                      e.target.value
                    )
                  }
                />

                {errors.contactNumber && (
                  <p className="text-xs text-destructive">
                    {errors.contactNumber}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Employment */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Employment
              </h3>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Assign the employee&apos;s role, type, and department.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="invite-role">
                  Role
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    updateField(
                      "role",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    id="invite-role"
                    className="w-full"
                  >
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
                  <p className="text-xs text-destructive">
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="employment-type">
                  Type
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    updateField(
                      "type",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    id="employment-type"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    {employmentTypes.map(
                      (type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                        >
                          {type.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                {errors.type && (
                  <p className="text-xs text-destructive">
                    {errors.type}
                  </p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">
                  Department
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Select
                  value={form.department}
                  onValueChange={(value) =>
                    updateField(
                      "department",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    id="department"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>

                  <SelectContent>
                    {departments.map(
                      (department) => (
                        <SelectItem
                          key={department.value}
                          value={department.value}
                        >
                          {department.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                {errors.department && (
                  <p className="text-xs text-destructive">
                    {errors.department}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Government IDs */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Government IDs
              </h3>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Enter government identification numbers if available.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* SSS */}
              <div className="space-y-2">
                <Label htmlFor="sss-id">
                  SSS ID
                </Label>

                <Input
                  id="sss-id"
                  placeholder="SSS ID number"
                  value={form.sssId}
                  onChange={(e) =>
                    updateField(
                      "sssId",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* PhilHealth */}
              <div className="space-y-2">
                <Label htmlFor="philhealth">
                  PhilHealth
                </Label>

                <Input
                  id="philhealth"
                  placeholder="PhilHealth number"
                  value={form.philhealth}
                  onChange={(e) =>
                    updateField(
                      "philhealth",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Pag-IBIG */}
              <div className="space-y-2">
                <Label htmlFor="pag-ibig">
                  Pag-IBIG
                </Label>

                <Input
                  id="pag-ibig"
                  placeholder="Pag-IBIG number"
                  value={form.pagIbig}
                  onChange={(e) =>
                    updateField(
                      "pagIbig",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* TIN */}
              <div className="space-y-2">
                <Label htmlFor="tin-number">
                  TIN Number
                </Label>

                <Input
                  id="tin-number"
                  placeholder="TIN number"
                  value={form.tinNumber}
                  onChange={(e) =>
                    updateField(
                      "tinNumber",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </section>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={
                inviteEmployeeMutation.isPending
              }
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={
              inviteEmployeeMutation.isPending
            }
            className="w-full sm:w-auto"
          >
            {inviteEmployeeMutation.isPending
              ? "Sending..."
              : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
