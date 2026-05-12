

import RegistrarSidebar from "@/components/registrar/RegistrarSidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">

            {/* Sidebar */}
            <RegistrarSidebar />

            {/* Main Content */}
            <main>
                {children}
            </main>

        </div>
    );
}