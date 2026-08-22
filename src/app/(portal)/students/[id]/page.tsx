import StudentInformation from "@/components/(portal)/students/StudentInformation";

export default async function StudentView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <StudentInformation id={id} />
    </div>
  );
}