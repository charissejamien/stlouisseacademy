"use client"

import { useQuery } from "@tanstack/react-query";
import { getUser } from "./actions";
import RegistrarDashboard from "@/components/(portal)/dashboard/RegistrarDashboard";

export default function Dashboard() {

    const date = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    })


    const { data: user} = useQuery({queryKey: ["user"], queryFn: getUser});

    return(
        <div className="w-[95%] mx-auto mt-10">
            
            <div className="text-white bg-gradient-to-r from-[#3153DE] to-[#6CB3F8] p-10 rounded-md w-full">
                <p className="text-sm text-gray-200">{date}</p>
                <h2 className="text-2xl font-medium pt-5">Welcome back, {user?.first_name}!</h2>
                <p className="text-sm pt-1">Always stay updated in your school system</p>
            </div>

            <RegistrarDashboard/>
            
        </div>
    );
}