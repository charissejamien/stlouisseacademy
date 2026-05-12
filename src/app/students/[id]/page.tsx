import StudentProfile from "@/components/students/StudentProfile";

export default async function StudentInformation({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params;

    console.log(id)

    return <StudentProfile id={id} />;
}