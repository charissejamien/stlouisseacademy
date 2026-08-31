"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  GraduationCap,
  Users,
  UserRound,
  UserPlus,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { getClassById } from "@/app/(portal)/classes/[id]/actions";

type ClassDetailsProps = {
  classId: string;
};

export default function ClassDetails({
  classId,
}: ClassDetailsProps) {
  const router = useRouter();

  const {
    data: classData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => getClassById(classId),
  });

  // ------------------------------------------
  // Loading
  // ------------------------------------------

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />

          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ------------------------------------------
  // Error
  // ------------------------------------------

  if (isError) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Classes
        </Button>

        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load class: {error.message}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // Not Found
  // ------------------------------------------

  if (!classData) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Classes
        </Button>

        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              This class could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ------------------------------------------
  // Derived values
  // ------------------------------------------

  const sectionName = classData.section_name;

    const sectionCode = classData.section_code;

    const classSize = classData.class_size ?? 0;

    const gradeLevel =
  classData.grade_level?.[0]?.grade_level ?? "Unknown Grade Level";

const schoolYear = classData.school_year?.[0]
  ? `${classData.school_year[0].start_year}-${classData.school_year[0].end_year}`
  : "Unknown School Year";

const isActive =
  classData.school_year?.[0]?.is_active ?? false;


    const adviserAssigned = Boolean(classData.adviser_id);

  // ------------------------------------------
  // Render
  // ------------------------------------------

  return (
    <div className="space-y-6">

      {/* ------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------ */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-start gap-3">

          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="mt-1 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex flex-wrap items-center gap-2">

              <h1 className="text-2xl font-bold tracking-tight">
                {sectionName}
              </h1>

              <Badge
                variant="secondary"
                className={
                  isActive
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                    : "bg-muted text-muted-foreground"
                }
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>

            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">

              <span>
                {gradeLevel}
              </span>

              <span>•</span>

              <span>
                {schoolYear}
              </span>

              {sectionCode && (
                <>
                  <span>•</span>

                  <span>
                    {sectionCode}
                  </span>
                </>
              )}

            </div>
          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Actions */}
        {/* ------------------------------------------ */}

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              // TODO: open adviser assignment dialog
            }}
          >
            <UserRound className="h-4 w-4" />
            Assign Adviser
          </Button>

          <Button
            className="gap-2"
            onClick={() => {
              // TODO: open student assignment dialog
            }}
          >
            <UserPlus className="h-4 w-4" />
            Assign Students
          </Button>

          <Button
            variant="outline"
            size="icon"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

        </div>

      </div>

      {/* ------------------------------------------ */}
      {/* Summary */}
      {/* ------------------------------------------ */}

      <div className="grid gap-4 md:grid-cols-3">

        {/* Students */}

        <Card>
          <CardContent className="flex items-center gap-4 p-5">

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Students
              </p>

              <p className="mt-1 text-2xl font-bold">
                {classSize}
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Adviser */}

        <Card>
          <CardContent className="flex items-center gap-4 p-5">

            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Class Adviser
              </p>

              <p className="mt-1 truncate font-semibold">
                {adviserAssigned
                  ? "Adviser Assigned"
                  : "No adviser assigned"}
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Grade */}

        <Card>
          <CardContent className="flex items-center gap-4 p-5">

            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Grade Level
              </p>

              <p className="mt-1 text-2xl font-bold">
                {gradeLevel}
              </p>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* ------------------------------------------ */}
      {/* Management Options */}
      {/* ------------------------------------------ */}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">

        {/* Students */}

        <Card>

          <CardHeader className="flex flex-row items-center justify-between">

            <div>
              <CardTitle>
                Students
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Students currently assigned to this class.
              </p>
            </div>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                // TODO: open student assignment dialog
              }}
            >
              <UserPlus className="h-4 w-4" />
              Add Students
            </Button>

          </CardHeader>

          <CardContent>

            <div className="rounded-md border border-dashed p-10 text-center">

              <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />

              <p className="mt-3 text-sm font-medium">
                Student roster
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Assigned students will appear here.
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  // TODO: open student assignment dialog
                }}
              >
                Assign Students
              </Button>

            </div>

          </CardContent>

        </Card>

        {/* Class Settings */}

        <Card>

          <CardHeader>
            <CardTitle>
              Class Management
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Manage this class and its assignments.
            </p>
          </CardHeader>

          <CardContent className="space-y-2">

            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 px-3 py-3"
              onClick={() => {
                // TODO: assign adviser
              }}
            >
              <UserRound className="h-4 w-4" />

              <div className="text-left">
                <p className="text-sm font-medium">
                  Assign Adviser
                </p>

                <p className="text-xs text-muted-foreground">
                  {adviserAssigned
                    ? "Change the class adviser."
                    : "Set the class adviser."}
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 px-3 py-3"
              onClick={() => {
                // TODO: assign students
              }}
            >
              <UserPlus className="h-4 w-4" />

              <div className="text-left">
                <p className="text-sm font-medium">
                  Assign Students
                </p>

                <p className="text-xs text-muted-foreground">
                  Add students to this section.
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 px-3 py-3"
              onClick={() => {
                // TODO: class settings
              }}
            >
              <Settings className="h-4 w-4" />

              <div className="text-left">
                <p className="text-sm font-medium">
                  Class Settings
                </p>

                <p className="text-xs text-muted-foreground">
                  Manage class configuration.
                </p>
              </div>
            </Button>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}
