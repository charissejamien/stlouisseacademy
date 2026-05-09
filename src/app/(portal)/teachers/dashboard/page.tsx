import SubjectsHandled from "@/components/teachers/SubjectsHandled";
import UpcomingSchedules from "@/components/teachers/UpcomingSchedules";
import Link from "next/link";

export default function Dashboard() {
    return(
        <div className="w-[80%] mx-auto mt-20 flex flex-col gap-10">
            <Link className="flex flex-col gap-5" href={`/teachers/classes`}>
                <h3 className="text-[20px] text-sla-blue font-semibold">Assigned Classes</h3>
                <SubjectsHandled/>
            </Link>
             <div className="flex flex-col gap-5">
                <h3 className="text-[20px] text-sla-blue font-semibold">Upcoming Schedules</h3>
                <UpcomingSchedules/>
            </div>
        </div>
    );
}