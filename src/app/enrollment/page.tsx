import EnrollmentForm from "@/components/enrollment/Enrollment";
import { getGradeLevels } from "../actions";

export default async function Enrollment() {

    const gradeLevels = await getGradeLevels();

    return(
        <div className="w-[90%] mx-auto mt-10">
            <h2 className="text-sla-blue text-[24px] font-semibold">Student Enrollment</h2>
            <EnrollmentForm gradeLevels={gradeLevels}/>
        </div>

    );
}