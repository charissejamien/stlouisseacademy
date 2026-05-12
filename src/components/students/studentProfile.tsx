import { getStudentProfile } from "@/app/students/actions";


export default async function StudentProfile({

    
    id,
}: {
    id: string;
}) {
    

    const student = await getStudentProfile(id);

    

    if (!student) {
    return <div>Student not found</div>;
}



    return (
        <div className="flex flex-col gap-5">
            <section className="bg-white rounded-md p-10 flex gap-10 items-center">
                        <div className="bg-sla-blue w-30 h-30"/>

                        <div className="flex flex-col gap-1">
                            <p className="text-[24px] text-sla-blue font-semibold">{student.last_name}, {student.first_name} </p>
                            <div className="flex gap-10">
                                <p className="text-[14px] text-sla-gray">ID: {student.student_id}</p>
                                <p className="text-[14px] text-sla-gray">Grade Level</p>
                            </div>
                        </div>
            </section>

            <section className="flex gap-5">
                <div className="bg-white rounded-md p-7 pr-20 flex flex-col gap-3">
                    <p className="text-sla-blue font-medium">Personal Information</p>
                    <div className="flex grid grid-cols-2 gap-5">
                       
                    </div>
                </div>

                <div className="bg-white rounded-md p-5">
                    <p className="text-sla-blue font-medium">Emergency Contact</p>
                </div>
            </section>
        </div>
    );
}