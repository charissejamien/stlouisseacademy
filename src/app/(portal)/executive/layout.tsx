import ExecutiveSidebar from "@/components/executive/ExecutiveSidebar"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <ExecutiveSidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}