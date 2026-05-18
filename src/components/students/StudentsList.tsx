"use client";

import { getClassList } from "@/app/students/actions";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";
import Link from "next/link";
import { useState } from "react";

export default function StudentsList() {

    const {data} = useQuery({queryKey: ["students"], queryFn: getClassList});
    const [search, setSearch] = useState("");


    return(
        <div className="w-full mt-5">
            <div className="flex gap-3 justify-end">
                <Input placeholder="Search by name" className="w-70" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <Input placeholder="Filter: All" className="w-25"/>
                <Input placeholder="Sort: Nam-Asc" className="w-25"/>
            </div>
            <div className="bg-white p-5 rounded-md mt-5 flex flex-col gap-1 w-full">
                {data?.map((d) => (
                <Link key={d.student_id} href={`/students/${d.student_id}`} className="flex border rounded-sm p-3 w-full">
                    <div className="flex gap-1 w-[60%]">
                        <p>{d.first_name}</p>
                        <p>{d.middle_name}</p>
                        <p>{d.last_name}</p>
                    </div>
                    <p className="w-[20%]">{d.gender}</p>
                    <p className="w-[20%]">{d.gradeLevel}</p>
                </Link>
                ))}
            </div>
            
        </div>
    );
}