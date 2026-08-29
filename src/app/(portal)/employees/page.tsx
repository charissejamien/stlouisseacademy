
import EmployeesList from "@/components/(portal)/employees/EmployeesList";
import InviteEmployee from "@/components/(portal)/employees/InviteEmployee";

export default function Employees() {
    return(
        <div className="w-[95%] mx-auto mt-20 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Manage Employees
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage employee records, roles, and employment information in one place.
                    </p>
                </div>

                <InviteEmployee/>
            </div>

            <EmployeesList/>

        </div>
    );
}