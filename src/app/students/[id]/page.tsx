import StudentProfile from "@/components/students/studentProfile";

export default async function StudentInformation({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params;

    return <StudentProfile id={id} />;
}