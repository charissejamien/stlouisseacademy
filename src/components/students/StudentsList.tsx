
import { getClassList } from "@/app/students/actions";
import { Input } from "../ui/input";
import Link from "next/link";

export default async function StudentsList() {

    const list = await getClassList();

    return(
        <div className="w-full mt-5">
            <div className="flex gap-3 justify-end">
                <Input placeholder="Search by name" className="w-70"/>
                <Input placeholder="Filter: All" className="w-25"/>
                <Input placeholder="Sort: Nam-Asc" className="w-25"/>
            </div>
            <div className="bg-white p-5 rounded-md mt-5 flex flex-col gap-1 w-full">
                {list?.map((l) => (
                <Link key={l.student_id} href={`/students/${l.student_id}`} className="flex border rounded-sm p-3 w-full">
                    <div className="flex gap-1 w-[60%]">
                        <p>{l.first_name}</p>
                        <p>{l.middle_name}</p>
                        <p>{l.last_name}</p>
                    </div>
                    <p className="w-[20%]">{l.gender}</p>
                    <p className="w-[20%]">{l.gradeLevel}</p>
                </Link>
                ))}
            </div>
            
        </div>
    );
}