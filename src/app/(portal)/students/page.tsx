"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllStudents } from "./actions";
import { getGradeLevels } from "../enrollment/actions";

export default function Students() {

    const [gradeLevel, setGradeLevel] = useState("");

    const { data: students } = useQuery({
        queryKey: ["students", gradeLevel],
        queryFn: () => getAllStudents(gradeLevel || undefined),
    });

    const { data: gradeLevels } = useQuery({queryKey: ["gradeLevels"], queryFn: getGradeLevels})
    
    const maleStudents = students?.filter(
        (student) => student.gender === "Male"
    );

    const femaleStudents = students?.filter(
        (student) => student.gender === "Female"
    );

    return(
        <div className="w-[90%] mx-auto mt-20">
            <div>
                <Select value={gradeLevel} onValueChange={(value) => setGradeLevel(value)}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue />
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
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* MALE */}
                    <TableRow>
                        <TableCell
                            colSpan={4}
                            className="font-bold bg-blue-50"
                        >
                            Male
                        </TableCell>
                    </TableRow>

                    {maleStudents?.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell>
                                {s.first_name} {s.last_name}
                            </TableCell>
                            <TableCell>{s.gender}</TableCell>
                        </TableRow>
                    ))}

                    {/* FEMALE */}
                    <TableRow>
                        <TableCell
                            colSpan={4}
                            className="font-bold bg-pink-50"
                        >
                            Female
                        </TableCell>
                    </TableRow>

                    {femaleStudents?.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell>
                                {s.first_name} {s.last_name}
                            </TableCell>
                            <TableCell>{s.gender}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}