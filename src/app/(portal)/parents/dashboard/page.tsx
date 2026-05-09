import StudentSummary from "@/components/parents/StudentSummary"
import AnnouncementsWidget from "@/components/parents/AnnouncementsWidget";
import Link from "next/link";


export default function Dashboard() {
    return (
        <div className="w-[80%] mx-auto mt-20 flex flex-col gap-5">
            <h2 className="text-[24px] font-medium">Welcome, Parent!</h2>

            <div>
                <AnnouncementsWidget/>
            </div>

            <div>
                <h3 className="text-[20px] text-sla-blue font-semibold">Student Profiles</h3>
                <div className="flex gap-3">
                    <Link href={`/parents/dashboard/student`}>
                        <StudentSummary/>
                    </Link>
                    
                    <StudentSummary/>
                    <StudentSummary/>
                </div>
            </div>

            <div>
                <h3 className="text-[20px] text-sla-blue font-semibold">Balance Summary</h3>
                
            </div>
        </div>
    );
}