import AdminSidebar from "@/components/admin/AdminSidebar"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  )
}