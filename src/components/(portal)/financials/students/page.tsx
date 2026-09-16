"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

import { getAllStudentsFinancials } from "@/app/(portal)/financials/students/actions";
import type { StudentFinancialRow } from "@/app/(portal)/financials/students/actions";
import { getGradeLevels } from "@/app/actions";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function sortStudentsAlphabetically(students: StudentFinancialRow[]) {
  return [...students].sort((a, b) => {
    const lastNameComparison = a.last_name.localeCompare(
      b.last_name,
      undefined,
      {
        sensitivity: "base",
      },
    );

    if (lastNameComparison !== 0) {
      return lastNameComparison;
    }

    return a.first_name.localeCompare(b.first_name, undefined, {
      sensitivity: "base",
    });
  });
}

export default function StudentsFinancialsPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [groupByGender, setGroupByGender] = useState(false);

  const {
    data: students = [],
    isLoading,
    isError,
    error,
  } = useQuery<StudentFinancialRow[]>({
    queryKey: ["students-financials"],
    queryFn: getAllStudentsFinancials,
  });

  const { data: gradeLevels = [], isLoading: isLoadingGradeLevels } = useQuery({
    queryKey: ["grade-levels"],
    queryFn: getGradeLevels,
  });

  const filteredStudents = useMemo(() => {
    const filtered =
      selectedGrade === "all"
        ? students
        : students.filter((student) => student.grade_level === selectedGrade);

    return sortStudentsAlphabetically(filtered);
  }, [students, selectedGrade]);

  const genderGroups = useMemo(() => {
    const male = filteredStudents.filter(
      (student) => student.gender?.toLowerCase() === "male",
    );

    const female = filteredStudents.filter(
      (student) => student.gender?.toLowerCase() === "female",
    );

    const other = filteredStudents.filter((student) => {
      const gender = student.gender?.toLowerCase();

      return gender !== "male" && gender !== "female";
    });

    return {
      male: sortStudentsAlphabetically(male),
      female: sortStudentsAlphabetically(female),
      other: sortStudentsAlphabetically(other),
    };
  }, [filteredStudents]);

  const financialSummary = useMemo(() => {
    return filteredStudents.reduce(
      (totals, student) => {
        totals.assessment += student.adjusted_total_tuition_fee;
        totals.paid += student.total_tuition_paid;
        totals.balance += student.tuition_balance;

        return totals;
      },
      {
        assessment: 0,
        paid: 0,
        balance: 0,
      },
    );
  }, [filteredStudents]);

  /*
   * ----------------------------------------
   * STUDENT ROW
   * ----------------------------------------
   */

  const renderStudentRow = (student: StudentFinancialRow) => (
    <TableRow
      key={student.id}
      onClick={() => router.push(`/students/${student.id}`)}
      className="cursor-pointer transition-colors hover:bg-muted/50"
    >
      {/* Student Name */}
      <TableCell className="font-medium">
        {student.last_name}, {student.first_name}
      </TableCell>

      {/* Grade */}
      <TableCell>{student.grade_level}</TableCell>

      {/* Adjusted Tuition */}
      <TableCell className="text-center">
        {formatCurrency(student.adjusted_total_tuition_fee)}
      </TableCell>

      {/* Tuition Paid */}
      <TableCell className="text-center">
        {formatCurrency(student.total_tuition_paid)}
      </TableCell>

      {/* Tuition Balance */}
      <TableCell
        className={`text-center font-medium ${
          student.tuition_balance > 0 ? "text-red-600" : "text-green-600"
        }`}
      >
        {student.tuition_balance <= 0
          ? "Paid"
          : formatCurrency(student.tuition_balance)}
      </TableCell>

      {/* Books Fee */}
      <TableCell className="text-center">
        {formatCurrency(student.total_books_fee)}
      </TableCell>

      {/* Books Balance */}
      <TableCell
        className={`text-center font-medium ${
          student.books_balance > 0 ? "text-red-600" : "text-green-600"
        }`}
      >
        {student.books_balance <= 0
          ? "Paid"
          : formatCurrency(student.books_balance)}
      </TableCell>
    </TableRow>
  );

  /*
   * ----------------------------------------
   * TABLE HEADER
   * ----------------------------------------
   */

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead>Student Name</TableHead>

        <TableHead>Grade Level</TableHead>

        <TableHead className="text-center">Tuition Assessment</TableHead>

        <TableHead className="text-center">Tuition Paid</TableHead>

        <TableHead className="text-center">Tuition Balance</TableHead>

        <TableHead className="text-center">Books Fee</TableHead>

        <TableHead className="text-center">Books Balance</TableHead>
      </TableRow>
    </TableHeader>
  );

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
        {/* FILTERS */}
        {/* -------------------------------- */}

        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          {/* Grade Filter */}

          <div className="w-full sm:w-[220px]">
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Grade Levels</SelectItem>

                {gradeLevels.map((grade) => (
                  <SelectItem key={grade.grade_level} value={grade.grade_level}>
                    {grade.grade_level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Grouping */}

          <Button
            type="button"
            variant={groupByGender ? "default" : "outline"}
            onClick={() => setGroupByGender((current) => !current)}
            className="w-full sm:w-auto"
          >
            {groupByGender ? "Grouped by Gender" : "Group by Gender"}
          </Button>
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* FINANCIAL SUMMARY CARDS */}
      {/* ---------------------------------- */}

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Assessment */}

        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Assessment
            </p>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialSummary.assessment)}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Total tuition assessment
              {selectedGrade !== "all" && ` for ${selectedGrade}`}
            </p>
          </CardContent>
        </Card>

        {/* Total Paid */}

        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Paid
            </p>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialSummary.paid)}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Total tuition payments
              {selectedGrade !== "all" && ` for ${selectedGrade}`}
            </p>
          </CardContent>
        </Card>

        {/* Remaining Balance */}

        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Remaining Balance
            </p>
          </CardHeader>

          <CardContent>
            <div
              className={`text-2xl font-bold ${
                financialSummary.balance > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {financialSummary.balance <= 0
                ? "Paid"
                : formatCurrency(financialSummary.balance)}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Total outstanding tuition
              {selectedGrade !== "all" && ` for ${selectedGrade}`}
            </p>
          </CardContent>
        </Card>
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
        {groupByGender && <> · Grouped by gender</>}
      </div>

      {/* ---------------------------------- */}
      {/* TABLE */}
      {/* ---------------------------------- */}

      <Card>
        <CardContent>
          <Table>
            {renderTableHeader()}

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
              ) : groupByGender ? (
                <>
                  {/* -------------------------------- */}
                  {/* MALE */}
                  {/* -------------------------------- */}

                  {genderGroups.male.length > 0 && (
                    <>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell colSpan={7} className="py-3 font-semibold">
                          Male{" "}
                          <span className="font-normal text-muted-foreground">
                            ({genderGroups.male.length})
                          </span>
                        </TableCell>
                      </TableRow>

                      {genderGroups.male.map(renderStudentRow)}
                    </>
                  )}

                  {/* -------------------------------- */}
                  {/* FEMALE */}
                  {/* -------------------------------- */}

                  {genderGroups.female.length > 0 && (
                    <>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell colSpan={7} className="py-3 font-semibold">
                          Female{" "}
                          <span className="font-normal text-muted-foreground">
                            ({genderGroups.female.length})
                          </span>
                        </TableCell>
                      </TableRow>

                      {genderGroups.female.map(renderStudentRow)}
                    </>
                  )}

                  {/* -------------------------------- */}
                  {/* OTHER / UNSPECIFIED */}
                  {/* -------------------------------- */}

                  {genderGroups.other.length > 0 && (
                    <>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell colSpan={7} className="py-3 font-semibold">
                          Other / Unspecified{" "}
                          <span className="font-normal text-muted-foreground">
                            ({genderGroups.other.length})
                          </span>
                        </TableCell>
                      </TableRow>

                      {genderGroups.other.map(renderStudentRow)}
                    </>
                  )}
                </>
              ) : (
                /*
                 * ----------------------------------------
                 * NORMAL ALPHABETICAL LIST
                 * ----------------------------------------
                 */

                filteredStudents.map(renderStudentRow)
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}