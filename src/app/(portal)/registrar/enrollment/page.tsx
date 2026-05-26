"use client";

import { useState } from "react";
import EnrollmentContainer from "@/components/registrar/enrollment/EnrollmentContainer";

type Parent = {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email?: string;
    contact_number?: string;
};

export default function Enrollment() {

    const [parent, setParent] = useState<Parent | null>(null);

    return (
        <div className="w-[90%] mx-auto">
            <h2 className="text-sla-blue text-[24px] font-semibold mt-10 mb-5">
                Student Enrollment
            </h2>

            <EnrollmentContainer />
        </div>
    );
}