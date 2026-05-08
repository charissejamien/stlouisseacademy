import FeesInput from "@/components/admin/configure/fees";
import ConfigureBooks from "@/components/admin/configure/books";
import ConfigureGradeLevels from "@/components/admin/configure/GradeLevels";
import ConfigureReportCard from "@/components/admin/configure/reportCard";


export default async function Fees() {
    return(
        <div>
            <FeesInput/>
            <ConfigureBooks/>
            <ConfigureGradeLevels/>
            <ConfigureReportCard/>

        </div>
    );
}