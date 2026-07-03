
import OpsSidebar from "@/components/ops/OpsSidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">

            {/* Sidebar */}
            <OpsSidebar />

            {/* Main Content */}
            <main>
                {children}
            </main>

        </div>
    );
}