"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getMyStudents } from "@/app/(portal)/dashboard/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParentDashboard() {
  const {
    data: students,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-students"],
    queryFn: getMyStudents,
  });

  return (
    <div className="mt-2">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">My Students</h2>

        <p className="text-sm text-muted-foreground">
          Students currently linked to your parent account.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>

              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">
          Failed to load your students.
        </p>
      ) : !students || students.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No students are currently linked to your account.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => {
            const enrollment = student.enrollments?.[0];

            return (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className="block"
              >
                <Card className="h-full cursor-pointer transition-all py-7 hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-base font-semibold text-xl">
                      {student.first_name}{" "}
                      {student.middle_name ? `${student.middle_name} ` : ""}
                      {student.last_name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {(() => {
                        const grade = enrollment?.grade_level;
                        if (!grade) return "No Grade Level";
                        const isEarlyYears = [
                          "nursery",
                          "pre-kindergarten",
                          "kindergarten",
                        ].includes(grade.toLowerCase());
                        return isEarlyYears ? grade : `Grade ${grade}`;
                      })()}
                    </p>

                    <p className="text-xs">
                      ID:{" "}
                      <span className="text-slate-700">
                        {student.student_id || "N/A"}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
