"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentsByParent } from "@/app/(portal)/parents/dashboard/actions";

interface EnrollmentRelation {
    grade_level: string;
}

interface StudentWithEnrollment {
    id: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    enrollments: EnrollmentRelation[] | EnrollmentRelation | null;
}

export default function StudentSummary() {
    const HARDCODED_PARENT_UUID = "26e7929e-77cd-4fea-847e-7c7cdb38db2d";

    // React Query to fetch all registered kids for this parent
    const { data: students = [], isLoading, isError, error } = useQuery<StudentWithEnrollment[]>({
        queryKey: ["parentStudents", HARDCODED_PARENT_UUID],
        queryFn: () => getStudentsByParent(HARDCODED_PARENT_UUID),
    });

    if (isLoading) {
        return <p className="text-sm text-muted-foreground italic">Retrieving family profiles layout...</p>;
    }

    if (isError) {
        return <p className="text-sm text-destructive font-medium">Error loading students: {error instanceof Error ? error.message : "Unknown Error"}</p>;
    }

    if (students.length === 0) {
        return <p className="text-sm text-muted-foreground italic">No student profiles are registered under this parent account yet.</p>;
    }

    return (
        <div className="flex flex-wrap gap-6 mt-5">
            {students.map((student) => {
                // Formatting Philippine Name Layout: Last Name, First Name Middle Initial.
                const middleInitial = student.middle_name ? `${student.middle_name.trim().charAt(0)}.` : "";
                const formattedFullName = `${student.last_name}, ${student.first_name} ${middleInitial}`.trim();

                // Safe fallback array check for Supabase 1-to-many relationship structures
                const activeEnrollment = Array.isArray(student.enrollments) 
                    ? student.enrollments[0] 
                    : student.enrollments;
                
                const gradeLevelDisplay = activeEnrollment?.grade_level || "Not Enrolled";

                return (
                    <div 
                        key={student.id} 
                        className="bg-white px-10 py-5 rounded-md w-fit border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    >
                        <p className="text-sla-blue text-[20px] font-semibold tracking-tight">{formattedFullName}</p>
                        <p className="text-sla-gray text-[14px]">
                            {gradeLevelDisplay} {activeEnrollment ? "- Amber" : ""}
                        </p>
                        
                        <div className="bg-background p-5 rounded-md mt-5 flex flex-col gap-1 items-center min-w-[200px]">
                            <p className="text-sla-gray text-[12px] font-medium tracking-wider">ATTENDANCE STATUS</p>
                            <p className="text-green-700 text-[24px] font-semibold">PRESENT</p>
                            <p className="text-gray-700 text-[12px] font-medium">recorded at 6:30 am</p>
                        </div>
                        
                        <div className="flex mt-3 justify-center">
                            <button 
                                className="bg-sla-blue text-white text-[14px] px-4 py-2 rounded-sm font-medium shadow-sm hover:bg-sla-blue/90 transition-colors"
                                onClick={() => console.log(`Redirecting to details for student ID: ${student.id}`)}
                            >
                                View Student Details
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}