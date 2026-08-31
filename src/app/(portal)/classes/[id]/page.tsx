import ClassDetails from "@/components/(portal)/classes/ClassDetails";

export default async function ClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ClassDetails classId={id} />;
}