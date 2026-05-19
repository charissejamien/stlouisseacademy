import Heading from "@/components/shared/Heading";
import ManagementSummary from "@/components/admin/dashboard/ManagementSummary";
import FinanceSummary from "@/components/admin/dashboard/FinanceSummary";
import InventorySummary from "@/components/admin/dashboard/InventorySummary";

export default function Dashboard() {
    return(
        <div className="w-[80%] mx-auto mt-5 flex flex-col gap-5">
            <Heading/>

            <div className="flex flex-col gap-3">
                <h3 className="text-[18px] font-medium">Management</h3>
                <ManagementSummary/>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-[18px] font-medium">Finance</h3>
                <FinanceSummary/>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-[18px] font-medium">Inventory</h3>
                <InventorySummary/>
            </div>

        </div>
    );
}