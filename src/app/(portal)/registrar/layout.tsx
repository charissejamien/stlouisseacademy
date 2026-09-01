export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
