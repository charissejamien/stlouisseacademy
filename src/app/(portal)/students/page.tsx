"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllStudents, getStudentsCount } from "./actions";
import { getGradeLevels } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function Students() {

    const router = useRouter();

    const [gradeLevel, setGradeLevel] = useState("Nursery");

    const { data: students, isLoading } = useQuery({
        queryKey: ["students", gradeLevel],
        queryFn: () => getAllStudents(gradeLevel || undefined),
    });

    const { data: gradeLevels } = useQuery({queryKey: ["gradeLevels"], queryFn: getGradeLevels})
    const { data: studentsCount } = useQuery({queryKey: ["studentsCount"], queryFn: getStudentsCount})

    const maleStudents = students?.filter(
        (student) => student.gender === "Male"
    );

    const femaleStudents = students?.filter(
        (student) => student.gender === "Female"
    );

    return(
        <div className="w-full h-full min-h-0 flex flex-col gap-10 mx-auto overflow-hidden">
            <div>
                <h3 className="text-3xl font-semibold">Student Master List</h3>
                <p className="text-sm text-gray-700/70">Central directory management for profile authentication, classroom assignments, and enrollment timeline tracking.</p>
            </div>
            <div className="flex gap-15">
                <Card className="w-full max-w-xs space-y-2 shadow-md">
                    <CardHeader>
                        <CardTitle className="uppercase text-sm text-gray-700/50">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-semibold">{studentsCount?.length}</p>
                    </CardContent>
                </Card>
                <Input></Input>
                <Select value={gradeLevel} onValueChange={(value) => setGradeLevel(value)}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Grade Levels</SelectLabel>
                        {gradeLevels?.map((g) => (
                            <SelectItem key={g.id} value={g.grade_level} >
                        {g.grade_level}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
                <Table>
                    <TableCaption>Showing {students?.length} student records.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Student ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead className="text-right">Enrollment Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="w-full">
                                <TableCell>
                                <Skeleton className="h-4 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {/* MALE */}
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="font-bold"
                                    >
                                        Male
                                    </TableCell>
                                </TableRow>

                                {maleStudents?.map((s) => (
                                    <TableRow
                                        key={s.id}
                                        onClick={() => router.push(`/students/${s.id}`)}
                                        className="cursor-pointer"
                                    >
                                        <TableCell className="w-[200px]">{s.student_id}</TableCell>
                                        <TableCell>
                                            {s.last_name}, {s.first_name}
                                        </TableCell>
                                        <TableCell>{s.gender}</TableCell>
                                        <TableCell>
                                            {new Date(s.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {/* FEMALE */}
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="font-bold"
                                    >
                                        Female
                                    </TableCell>
                                </TableRow>

                                {femaleStudents?.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.student_id}</TableCell>
                                        <TableCell>
                                            {s.last_name}, {s.first_name}
                                        </TableCell>
                                        <TableCell>{s.gender}</TableCell>
                                        <TableCell>
                                            {new Date(s.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
            
        </div>
    );
}