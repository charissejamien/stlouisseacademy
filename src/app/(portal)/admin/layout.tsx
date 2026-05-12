

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-min-screen">

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main>
                {children}
            </main>

        </div>
    );
}