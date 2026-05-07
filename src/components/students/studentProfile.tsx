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
        <div className="w-[80%] mx-auto mt-20">
            <div className="bg-white rounded-md p-5">
                <h2>Student Profile</h2>

                <p>{student.first_name}</p>
            </div>
        </div>
    );
}