import EnrollmentForm from "@/components/registrar/enrollment/EnrollmentForm";
import { getGradeLevels } from "@/app/actions";
import { getTuitionFees } from "./actions";
import { getDiscounts } from "./actions";
import { getBooksFees } from "./actions";


export default async function Enrollment() {

    const gradeLevels = await getGradeLevels();
    const tuitionFees = await getTuitionFees();
    const discounts = await getDiscounts();
    const books = await getBooksFees();

    return(
        <div className="w-[90%] mx-auto mt-10">
            <h2 className="text-sla-blue text-[24px] font-semibold mt-20 mb-5">Student Enrollment</h2>
            <EnrollmentForm gradeLevels={gradeLevels} tuitionFees={tuitionFees} discounts={discounts} books={books}/>
        </div>

    );
}