"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

type Parent = {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email?: string;
    contact_number?: string;
};

type StudentSummary = {
    firstName: string;
    lastName: string;
    gradeLevel: string;
};

type FeeSettlementProps = {
    parent: Parent;
    enrolledStudents: StudentSummary[];
};

export default function FeeSettlement({ parent, enrolledStudents }: FeeSettlementProps) {
    const parentFullName = [parent.first_name, parent.middle_name, parent.last_name]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="bg-muted p-4 rounded-md border border-input/40">
                <p className="text-sm text-muted-foreground">Fee Settlement Phase for Parent:</p>
                <h3 className="text-xl font-bold text-sla-blue">{parentFullName}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold tracking-tight">Enrolled Students Summary</h2>
                    {enrolledStudents.map((student, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                {idx + 1}
                            </div>
                            <div>
                                <h4 className="font-semibold leading-none mb-1">
                                    {student.firstName} {student.lastName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Grade Level: <span className="font-medium text-foreground">{student.gradeLevel}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <Card>
                        <CardTitle className="px-5 pt-5">Fee Assessment Calculation</CardTitle>
                        <CardContent>
                            <p className="text-sm text-muted-foreground italic">
                                Ready for your custom fee structures, discounts, and payment methods.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}