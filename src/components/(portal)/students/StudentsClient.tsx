"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getAllStudents,
  getStudentsCount,
} from "@/app/(portal)/students/actions";
import { getGradeLevels } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function StudentsClient() {
  const router = useRouter();

  const [gradeLevel, setGradeLevel] = useState("Nursery");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: students, isLoading } = useQuery({
    queryKey: ["students-all"],
    queryFn: () => getAllStudents(),
  });

  const { data: gradeLevels } = useQuery({
    queryKey: ["gradeLevels"],
    queryFn: getGradeLevels,
  });
  const { data: studentsCount } = useQuery({
    queryKey: ["studentsCount"],
    queryFn: getStudentsCount,
  });

  const filteredStudents = students?.filter((student) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const studentId = student.student_id?.toLowerCase() || "";
    const query = searchQuery.trim().toLowerCase();

    const studentGrade = student.enrollments?.[0]?.grade_level;

    if (query) {
      return fullName.includes(query) || studentId.includes(query);
    }

    return gradeLevel ? studentGrade === gradeLevel : true;
  });

  const maleStudents = filteredStudents?.filter(
    (student) => student.gender === "Male",
  );

  const femaleStudents = filteredStudents?.filter(
    (student) => student.gender === "Female",
  );

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-10 mx-auto overflow-hidden">
      <div>
        <h3 className="text-3xl font-semibold">Student Master List</h3>
        <p className="text-sm text-gray-700/70">
          Central directory management for profile authentication, classroom
          assignments, and enrollment timeline tracking.
        </p>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <Card className="w-full max-w-xs space-y-2 shadow-md">
          <CardHeader>
            <CardTitle className="uppercase text-sm text-gray-700/50">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">
              {studentsCount?.length ?? 0}
            </p>
          </CardContent>
        </Card>

        <Input
          placeholder="Search by name or ID across all students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        <Select
          value={gradeLevel}
          onValueChange={(value) => {
            setGradeLevel(value);
            setSearchQuery("");
          }}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select grade level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Grade Levels</SelectLabel>
              {gradeLevels?.map((g) => (
                <SelectItem key={g.id} value={g.grade_level}>
                  {g.grade_level}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <Table>
          <TableCaption>
            Showing {filteredStudents?.length ?? 0} student records.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="text-right">Enrollment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {/* MALE SECTION */}
                <TableRow>
                  <TableCell colSpan={5} className="font-bold bg-muted/50">
                    Male ({maleStudents?.length ?? 0})
                  </TableCell>
                </TableRow>

                {maleStudents?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-4"
                    >
                      No male students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  maleStudents?.map((s) => {
                    const studentGrade = s.enrollments?.[0]?.grade_level;
                    return (
                      <TableRow
                        key={s.id}
                        onClick={() => router.push(`/students/${s.id}`)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="w-[180px]">
                          {s.student_id}
                        </TableCell>
                        <TableCell>
                          {s.last_name}, {s.first_name}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                            {studentGrade || "Unassigned"}
                          </span>
                        </TableCell>
                        <TableCell>{s.gender}</TableCell>
                        <TableCell className="text-right">
                          {new Date(s.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}

                {/* FEMALE SECTION */}
                <TableRow>
                  <TableCell colSpan={5} className="font-bold bg-muted/50">
                    Female ({femaleStudents?.length ?? 0})
                  </TableCell>
                </TableRow>

                {femaleStudents?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-4"
                    >
                      No female students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  femaleStudents?.map((s) => {
                    const studentGrade = s.enrollments?.[0]?.grade_level;
                    return (
                      <TableRow
                        key={s.id}
                        onClick={() => router.push(`/students/${s.id}`)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="w-[180px]">
                          {s.student_id}
                        </TableCell>
                        <TableCell>
                          {s.last_name}, {s.first_name}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                            {studentGrade || "Unassigned"}
                          </span>
                        </TableCell>
                        <TableCell>{s.gender}</TableCell>
                        <TableCell className="text-right">
                          {new Date(s.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}