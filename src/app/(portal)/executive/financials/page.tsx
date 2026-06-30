import React from "react";
import { getActiveSchoolYear } from "@/app/actions";
import FinancialOverview from "@/components/executive/financials/FinancialOverview";

export default async function ExecutiveFinancialsPage() {
    // 🎯 DYNAMIC CENTRAL RESOLUTION: Pulls from your shared global workspace action
    const activeSchoolYearId = await getActiveSchoolYear();

    return (
        /* Enforces structural screen bounds while leaving table workflows interactive */
        <div className="w-full h-screen overflow-y-auto bg-white">
            <FinancialOverview initialSchoolYearId={activeSchoolYearId} />
        </div>
    );
}