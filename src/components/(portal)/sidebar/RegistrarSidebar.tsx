import { Label } from "@/components/ui/label";
import { User, Users, Wallet, ListSortAscending, FileSliders, LogOut, Settings, CreditCard, FolderCog, FolderOpenDot, FilePlusCorner, Folder} from "lucide-react";

export default function RegistrarSidebar() {

    const management = [
        {icon: User, title: "Students" , link: "/" },
        {icon: Users, title: "Employees" , link: "/" },
        {icon: ListSortAscending, title: "Parents" , link: "/" }
    ]

    const financials = [
        {icon: FilePlusCorner, title: "Enrollment" , link: "/" },
        {icon: Wallet, title: "Payments" , link: "/" },
        {icon: CreditCard, title: "DCPR" , link: "/" },
        {icon: FolderOpenDot, title: "Expenses" , link: "/" },
        {icon: FileSliders, title: "Payroll" , link: "/" }
    ]

    const account = [
        {icon: Settings, title: "Settings" , link: "/" },
        {icon: LogOut, title: "Log out" , link: "/" }
    ]

    return(
        <div className="p-5 space-y-10 bg-[#2f6ed6] text-white/80 h-full rounded-xl">

            <header>
                <h1>ST. LOUISSE ACADEMY</h1>
                <p>Daanbantayan</p>
            </header>

            <section className="space-y-10">

                <div className="space-y-2.5 cursor-pointer">
                    <Label className="uppercase text-sm text-white">Management</Label>
                    {management.map((m , i) => (
                        <div key={i} className="flex pl-2 gap-2 items-center group hover:text-white">
                            <m.icon size={18}/>
                            <p>{m.title}</p>
                        </div>
                    ))}
                </div>
                
                <div className="space-y-2.5 cursor-pointer">
                    <Label className="uppercase text-sm text-white">Financials</Label>
                    {financials.map((m , i) => (
                        <div key={i} className="flex pl-2 gap-2 items-center group hover:text-white">
                            <m.icon size={18}/>
                            <p>{m.title}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-2.5 cursor-pointer">
                    <Label className="uppercase text-sm text-white">Configuration</Label>
                    <div className="flex pl-2 gap-2 items-center group hover:text-white">
                        <FolderCog size={18}/>
                        <p>Academics</p>
                    </div>
                </div>

                <div className="space-y-2.5 cursor-pointer">
                    <Label className="uppercase text-sm text-white">Account</Label>
                    {account.map((m , i) => (
                        <div key={i} className="flex pl-2 gap-2 items-center group hover:text-white">
                            <m.icon size={18}/>
                            <p>{m.title}</p>
                        </div>
                    ))}
                </div>

            </section>

        </div>
    );
}