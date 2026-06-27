"use client";

import EscGrantManagerTable from "@/components/shared/EscGrantManagerTable";

export default function ExecutiveEscContractsPage() {
    const ACTIVE_SCHOOL_YEAR_UUID = "8ca2cef9-7a33-41e4-aea5-5af8cc40625f";

    return (
        /* Enforces static application dashboard positioning without body clipping breakages */
        <div className="p-6 w-full h-screen overflow-hidden bg-white flex flex-col gap-4">
            <div className="shrink-0">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">JHS ESC Subsidy Operations</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                    Configure institutional Education Service Contracting grants for junior high school cohorts.
                </p>
            </div>

            {/* The component loads, handles lookup values, and mutates dynamically here */}
            <EscGrantManagerTable activeSchoolYearId={ACTIVE_SCHOOL_YEAR_UUID} />
        </div>
    );
}