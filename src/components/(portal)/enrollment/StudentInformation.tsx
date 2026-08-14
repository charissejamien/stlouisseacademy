"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import type { Student } from "@/app/(portal)/enrollment/types"
import { getSchoolYears, getGradeLevels } from "@/app/(portal)/enrollment/actions"

type StudentInformationProps = {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    errors: Record<number, Record<string, string>>;
};

export default function StudentInformation({students, setStudents, errors} : StudentInformationProps) {

    const gender = ["Male", "Female"];
    const studentType = ["New", "Returning"];
    const suffix = ["Jr.", "II", "III", "IV", "V", ""];

    const addStudentCard = () => {
        setStudents((prev) => [
            ...prev, {
                firstName: "",
                middleName: "",
                lastName: "",
                suffix: "",
                address: "",
                dateOfBirth: "",
                gender: "",
                schoolYear: "",
                gradeLevel: "",
                studentType: ""
            }
        ])
    };

    const updateStudent = (index: number, field: string, value: string) => {
        setStudents((prev) => prev.map((student, i) => 
            i === index ? {...student, [field]: value} : student
        ))
    };

    const deleteStudentCard = (index: number) => {
        setStudents((prev) => prev.filter((student, i) => i !== index))
    }

    const { data: schoolYears } = useQuery({queryKey: ["schoolYears"], queryFn: getSchoolYears})
    const { data: gradeLevels } = useQuery({queryKey: ["gradeLevels"], queryFn: getGradeLevels})

    return(
        <div>
            <Button onClick={addStudentCard}>Add Student</Button>

            {students.map((student, index) => (
                <Card className="w-full min-w-3xl mt-5" key={index}>
                    <CardHeader className="pb-6">
                        <Button onClick={() => deleteStudentCard(index)}>Delete Student</Button>
                    </CardHeader>
                    <CardHeader className="pb-6">
                        <CardTitle>Student Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-muted-foreground">
                                Academic Information
                            </p>

                            <div className="grid grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <Label>School Year</Label>
                                    <Select value={student.schoolYear} onValueChange={(value) => updateStudent(index, "schoolYear", value)}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>School Years</SelectLabel>
                                            {schoolYears?.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                {s.start_year} - {s.end_year}
                                                </SelectItem>
                                            ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors[index]?.schoolYear && (
                                        <p className="text-sm text-red-500">
                                            {errors[index].schoolYear}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Grade Level</Label>
                                    <Select value={student.gradeLevel} onValueChange={(value) => updateStudent(index, "gradeLevel", value)}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Grade Levels</SelectLabel>
                                            {gradeLevels?.map((g) => (
                                                <SelectItem key={g.id} value={g.id}>
                                            {g.grade_level}
                                                </SelectItem>
                                            ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors[index]?.gradeLevel && (
                                        <p className="text-sm text-red-500">
                                            {errors[index].gradeLevel}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Student Type</Label>
                                    <Select value={student.studentType} onValueChange={(value) => updateStudent(index, "studentType", value)}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Student Type</SelectLabel>
                                            {studentType.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                {s}
                                                </SelectItem>
                                            ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors[index]?.studentType && (
                                        <p className="text-sm text-red-500">
                                            {errors[index].studentType}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-medium text-muted-foreground">
                                Personal Information
                            </p>

                            <div className="grid grid-cols-2 gap-x-5 gap-y-5">

                                <div className="space-y-2">
                                    <Label>First Name <span aria-hidden="true">*</span></Label>
                                    <Input 
                                        value={student.firstName} 
                                        onChange={(e) => updateStudent(index, "firstName", e.target.value)}
                                    />
                                    {errors[index]?.firstName && (
                                        <p className="text-sm text-red-500">
                                            {errors[index].firstName}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Middle Name</Label>
                                    <Input 
                                        value={student.middleName} 
                                        onChange={(e) => updateStudent(index, "middleName", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Last Name <span aria-hidden="true">*</span></Label>
                                    <Input 
                                        value={student.lastName} 
                                        onChange={(e) => updateStudent(index, "lastName", e.target.value)}
                                    />
                                    {errors[index]?.lastName && (
                                        <p className="text-sm text-red-500">
                                            {errors[index].lastName}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Suffix</Label>
                                    <Select value={student.suffix} onValueChange={(value) => updateStudent(index, "suffix", value)}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Suffix</SelectLabel>
                                            {suffix.map((s) => (
                                                <SelectItem key={s} value={s}> 
                                                {s}
                                                </SelectItem>
                                            ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label>Address <span aria-hidden="true">*</span></Label>
                                    <Input 
                                        value={student.address} 
                                        onChange={(e) => updateStudent(index, "address", e.target.value)}
                                    />
                                    {errors[index]?.address && (
                                        <p className="text-sm text-red-500">
                                            {errors[index].address}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Date of Birth <span aria-hidden="true">*</span></Label>
                                </div>

                                <div className="space-y-2">
                                    <Label>Gender <span aria-hidden="true">*</span></Label>
                                    <Select value={student.gender} onValueChange={(value) => updateStudent(index, "gender", value)}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Gender</SelectLabel>
                                            {gender.map((g) => (
                                                <SelectItem key={g} value={g}>
                                                {g}
                                                </SelectItem>
                                            ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors[index]?.gender && (
                                        <p className="text-sm text-red-500">
                                            {errors[index].gender}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}