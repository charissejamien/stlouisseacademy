import ConfigureSchoolFees from "@/components/admin/configure/fees";
import ConfigureBooks from "@/components/admin/configure/books";
import ConfigureGradeLevels from "@/components/admin/configure/GradeLevels";
import ConfigureReportCard from "@/components/admin/configure/reportCard";

import GetSchoolFees from "@/components/admin/configure/SchoolFees";


export default async function Fees() {
    return(
        <div>
            <ConfigureSchoolFees/>
            <GetSchoolFees/>
            <ConfigureBooks/>
            <ConfigureGradeLevels/>
            <ConfigureReportCard/>

        </div>
    );
}