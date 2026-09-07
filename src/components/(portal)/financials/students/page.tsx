"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { getAllStudentsFinancials } from "@/app/(portal)/financials/students/actions";
import type { StudentFinancialRow } from "@/app/(portal)/financials/students/actions";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function StudentsFinancialsPage() {
  const [selectedGrade, setSelectedGrade] = useState("all");

  const {
    data: students = [],
    isLoading,
    isError,
    error,
  } = useQuery<StudentFinancialRow[]>({
    queryKey: ["students-financials"],
    queryFn: getAllStudentsFinancials,
  });

  const gradeLevels = useMemo(() => {
    const grades = new Set<string>();

    students.forEach((student) => {
      if (student.grade_level) {
        grades.add(student.grade_level);
      }
    });

    return Array.from(grades).sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );
  }, [students]);
  const filteredStudents = useMemo(() => {
    if (selectedGrade === "all") {
      return students;
    }

    return students.filter((student) => student.grade_level === selectedGrade);
  }, [students, selectedGrade]);

  /*
   * ----------------------------------------
   * LOADING
   * ----------------------------------------
   */

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * ----------------------------------------
   * ERROR
   * ----------------------------------------
   */

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Failed to load student financials</AlertTitle>

          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading student financial information."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  /*
   * ----------------------------------------
   * PAGE
   * ----------------------------------------
   */

  return (
    <div className="space-y-6 p-6">
      {/* ---------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------- */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Student Financials
          </h1>

          <p className="text-sm text-muted-foreground">
            View tuition and books assessments, payments, and remaining
            balances.
          </p>
        </div>

        {/* -------------------------------- */}
        {/* GRADE FILTER */}
        {/* -------------------------------- */}

        <div className="w-full md:w-[220px]">
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by grade" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Grade Levels</SelectItem>

              {gradeLevels.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* SUMMARY */}
      {/* ---------------------------------- */}

      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {filteredStudents.length}
        </span>{" "}
        {filteredStudents.length === 1 ? "student" : "students"}
        {selectedGrade !== "all" && (
          <>
            {" "}
            in{" "}
            <span className="font-medium text-foreground">{selectedGrade}</span>
          </>
        )}
      </div>

      {/* ---------------------------------- */}
      {/* TABLE */}
      {/* ---------------------------------- */}

      <Card>
        <CardHeader>
          <CardTitle>Student Financial Records</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>

                  <TableHead>Grade Level</TableHead>

                  <TableHead className="text-right">
                    Tuition Assessment
                  </TableHead>

                  <TableHead className="text-right">Tuition Paid</TableHead>

                  <TableHead className="text-right">Tuition Balance</TableHead>

                  <TableHead className="text-right">Books Fee</TableHead>

                  <TableHead className="text-right">Books Balance</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No students found for this grade level.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      {/* Student Name */}
                      <TableCell className="font-medium">
                        {student.last_name}, {student.first_name}
                      </TableCell>

                      {/* Grade */}
                      <TableCell>{student.grade_level}</TableCell>

                      {/* Adjusted Tuition */}
                      <TableCell className="text-right">
                        {formatCurrency(student.adjusted_total_tuition_fee)}
                      </TableCell>

                      {/* Tuition Paid */}
                      <TableCell className="text-right">
                        {formatCurrency(student.total_tuition_paid)}
                      </TableCell>

                      {/* Tuition Balance */}
                      <TableCell
                        className={`text-right font-medium ${
                          student.tuition_balance > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {formatCurrency(student.tuition_balance)}
                      </TableCell>

                      {/* Books Fee */}
                      <TableCell className="text-right">
                        {formatCurrency(student.total_books_fee)}
                      </TableCell>

                      {/* Books Balance */}
                      <TableCell
                        className={`text-right font-medium ${
                          student.books_balance > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {formatCurrency(student.books_balance)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
