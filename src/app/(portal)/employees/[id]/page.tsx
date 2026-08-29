import EmployeeDetails from "@/components/(portal)/employees/EmployeeDetails"

type EmployeePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EmployeePage({
  params,
}: EmployeePageProps) {
  const { id } = await params

  return (
    <EmployeeDetails employeeId={id} />
  )
}
