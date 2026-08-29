"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Badge,
} from "@/components/ui/badge"

import {
  Skeleton,
} from "@/components/ui/skeleton"

import {
  Users,
  ChevronRight,
} from "lucide-react"

import {
  GetClasses,
} from "@/app/(portal)/classes/actions"


export default function ClassesList() {

  const {
    data: classes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: GetClasses,
  })


  // ------------------------------------------
  // Loading
  // ------------------------------------------

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />

              <Skeleton className="h-4 w-64" />
            </div>

            <Skeleton className="h-4 w-20" />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="h-[calc(100vh-280px)] min-h-[350px] overflow-y-auto rounded-md border">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b">
                  <th className="h-11 px-4 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>

                  <th className="h-11 px-4 text-left">
                    <Skeleton className="h-4 w-28" />
                  </th>

                  <th className="h-11 px-4 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>

                  <th className="h-11 px-4 text-left">
                    <Skeleton className="h-4 w-24" />
                  </th>

                  <th className="h-11 px-4 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>

                  <th className="w-[40px]" />
                </tr>
              </thead>

              <tbody>
                {Array.from({
                  length: 8,
                }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-b"
                  >
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-28" />
                    </td>

                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>

                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-10" />
                    </td>

                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>

                    <td className="px-4 py-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>

                    <td />
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>
    )
  }


  // ------------------------------------------
  // Error
  // ------------------------------------------

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Failed to load classes:{" "}
        {error.message}
      </div>
    )
  }


  // ------------------------------------------
  // Empty
  // ------------------------------------------

  if (!classes || classes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Classes
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Manage sections and class advisers.
          </p>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No sections found for the
              active school year.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }


  // ------------------------------------------
  // Group by Grade Level
  // ------------------------------------------

  const groupedClasses =
    classes.reduce<
      Record<string, typeof classes>
    >((groups, classItem) => {

      if (!groups[classItem.gradeLevel]) {
        groups[classItem.gradeLevel] = []
      }

      groups[classItem.gradeLevel].push(
        classItem
      )

      return groups
    }, {})


  // ------------------------------------------
  // Render
  // ------------------------------------------

  return (
    <Card>

      <CardHeader className="pb-4">

        <div className="flex items-center justify-between">

          <div>
            <CardTitle>
              Classes
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage sections and class advisers.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {classes.length}{" "}
            {classes.length === 1
              ? "section"
              : "sections"}
          </div>

        </div>

      </CardHeader>


      <CardContent className="pt-0">

        {/* Scrollable Table */}

        <div className="h-[calc(100vh-280px)] min-h-[350px] overflow-y-auto rounded-md border">

          <table className="w-full text-sm">

            {/* Header */}

            <thead className="sticky top-0 z-10 bg-background">

              <tr className="border-b">

                <th className="h-11 px-4 text-left font-medium text-muted-foreground">
                  Section
                </th>

                <th className="h-11 px-4 text-left font-medium text-muted-foreground">
                  Class Adviser
                </th>

                <th className="h-11 px-4 text-left font-medium text-muted-foreground">
                  Class Size
                </th>

                <th className="h-11 px-4 text-left font-medium text-muted-foreground">
                  School Year
                </th>

                <th className="h-11 w-[100px] px-4 text-left font-medium text-muted-foreground">
                  Status
                </th>

                <th className="w-[40px]" />

              </tr>

            </thead>


            <tbody>

              {Object.entries(
                groupedClasses
              ).map(
                ([gradeLevel, sections]) => (
                  <GradeGroup
                    key={gradeLevel}
                    gradeLevel={gradeLevel}
                    classes={sections}
                  />
                )
              )}

            </tbody>

          </table>

        </div>

      </CardContent>

    </Card>
  )
}


// ==========================================
// Grade Group
// ==========================================

function GradeGroup({
  gradeLevel,
  classes,
}: {
  gradeLevel: string
  classes: Awaited<
    ReturnType<typeof GetClasses>
  >
}) {

  return (
    <>

      {/* Grade Level */}

      <tr className="border-b bg-muted/40">

        <td
          colSpan={6}
          className="px-4 py-2"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {gradeLevel}
          </span>
        </td>

      </tr>


      {/* Sections */}

      {classes.map((classItem) => (

        <tr
          key={classItem.id}
          className="
            group
            cursor-pointer
            border-b
            transition-colors
            hover:bg-muted/30
          "
        >

          {/* Section */}

          <td className="px-4 py-4">

            <div className="flex flex-col">

              <span className="font-medium text-slate-800">
                {classItem.section}
              </span>

              {classItem.sectionCode && (
                <span className="text-xs text-muted-foreground">
                  {classItem.sectionCode}
                </span>
              )}

            </div>

          </td>


          {/* Adviser */}

          <td className="px-4 py-4">

            {classItem.adviser ? (
              <div className="flex flex-col">

                <span className="text-sm text-slate-700">
                  {classItem.adviser}
                </span>

                {classItem.adviserEmployeeId && (
                  <span className="text-xs text-muted-foreground">
                    {classItem.adviserEmployeeId}
                  </span>
                )}

              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                No adviser assigned
              </span>
            )}

          </td>


          {/* Class Size */}

          <td className="px-4 py-4">

            <div className="flex items-center gap-2 text-sm text-slate-600">

              <Users className="h-3.5 w-3.5 text-muted-foreground" />

              {classItem.classSize ??
                "—"}

            </div>

          </td>


          {/* School Year */}

          <td className="px-4 py-4 text-sm text-muted-foreground">
            {classItem.schoolYear}
          </td>


          {/* Status */}

          <td className="px-4 py-4">

            <Badge
              variant="secondary"
              className="
                bg-emerald-50
                text-emerald-700
                hover:bg-emerald-50
              "
            >
              Active
            </Badge>

          </td>


          {/* Action */}

          <td className="px-2 py-4">

            <ChevronRight
              className="
                h-4
                w-4
                text-muted-foreground/40
                transition-transform
                group-hover:translate-x-0.5
                group-hover:text-muted-foreground
              "
            />

          </td>

        </tr>

      ))}

    </>
  )
}
