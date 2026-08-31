"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getMyStudents } from "@/app/(portal)/dashboard/actions";
import { Skeleton } from "@/components/ui/skeleton";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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
        <div className="mt-6">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    My Students
                </h2>

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

                            <CardContent>
                                <Skeleton className="h-4 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : isError ? (
                <p className="text-sm text-destructive">
                    Failed to load your students.
                </p>
            ) : students?.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No students are currently linked to your account.
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {students?.map((student) => (
                        <Link
                            key={student.id}
                            href={`/students/${student.id}`}
                            className="block"
                        >
                            <Card className="h-full cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md">
                                <CardHeader>
                                    <CardTitle>
                                        {student.first_name}{" "}
                                        {student.middle_name
                                            ? `${student.middle_name} `
                                            : ""}
                                        {student.last_name}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Student
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}