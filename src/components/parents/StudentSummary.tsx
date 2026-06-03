"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2, GraduationCap, Users } from "lucide-react";
import { getStudentsByParent } from "@/app/(portal)/parents/dashboard/actions";

interface EnrollmentNestedRecord {
    grade_level: string;
}

interface SiblingRecord {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    enrollments: EnrollmentNestedRecord[];
}

export default function StudentSummary() {
    const currentParentId = "573de3a8-fc13-4b20-ace7-a214bffdd96e"; 

    const { data: students = [], isLoading, isError } = useQuery<SiblingRecord[]>({
        queryKey: ["parentStudents", currentParentId],
        queryFn: () => getStudentsByParent(currentParentId), // Fixed overload function typing parameter signature
        enabled: !!currentParentId,
    });

    if (isLoading) {
        return <Loader2 className="w-6 h-6 animate-spin text-sla-blue mt-4" />;
    }

    if (isError || students.length === 0) {
        return (
            <div className="mt-3 p-6 bg-slate-50 border border-dashed rounded-xl flex items-center gap-3 text-muted-foreground">
                <Users className="w-5 h-5 text-slate-400" />
                <p className="text-sm">No registered student profiles found for this account portal link.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {students.map((student: SiblingRecord) => {
                const currentGradeLevel = student.enrollments?.[0]?.grade_level || "Not Assigned";

                return (
                    // 🔄 THE LINK WRAPPER: Passes the real child database UUID through search params on layout trigger click
                    <Link 
                        key={student.id} 
                        href={`/parents/balance?studentId=${student.id}`}
                        className="block cursor-pointer group transition-all"
                    >
                        {/* 🎨 BACK TO ORIGINAL: Your exact original flex container layout alignment with the grey sidebar icon box badge */}
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm group-hover:border-sla-blue/40 group-hover:shadow-md transition-all flex items-center gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-sla-blue/10 text-slate-600 group-hover:text-sla-blue transition-colors">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-base">
                                    {student.first_name} {student.last_name}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Grade Level: <span className="font-semibold text-slate-600">{currentGradeLevel}</span>
                                </p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}