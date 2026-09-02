import AddParent from "@/components/(portal)/parents/AddParent";
import ParentsList from "@/components/(portal)/parents/ParentsList";

export default function Parents() {
    return (
        <div className="flex flex-col space-y-6">
            {/* Header section with the Add Parent button pushed to the right */}
            <div className="flex items-center justify-between w-full">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Parent Management</h1>
                    <p className="text-sm text-muted-foreground">Manage and view all registered parent accounts.</p>
                </div>

                <div className="flex justify-end">
                    <AddParent />
                </div>
            </div>

            {/* List section below */}
            <ParentsList />
        </div>
    );
}