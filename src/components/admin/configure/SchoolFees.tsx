import { getTuitionFees } from "@/app/(portal)/admin/configuration/actions";

export default async function GetSchoolFees() {

    const fees = await getTuitionFees();

    return(
        <div>
            {fees?.map((f , index) => (
                <div key={index} className="flex gap-3">
                    <p>{f.grade_level}</p>
                    <p>{f.base_tuition}</p>
                    <p>{f.miscellaneous}</p>
                    <p>{f.total_tuition}</p>
                </div>
            ))}
        </div>
    );
}