import Image from "next/image";
import { getJobOpenings } from "@/app/actions";

export default async function Card() {

const jobs = await getJobOpenings();
if(!jobs) return <p>no jobs found</p>;

    return (
        <div className="flex gap-5">
            {jobs.map((job) => 
            <div key={job} className="relative overflow-hidden w-fit text-white hover:shadow-xl hover:scale-[1.02] duration-500 hover:brightness-110">
            <Image src="/job-opening-bg.png" alt="" width={320} height={200} className="object-cover z-0"/>
            <div className="absolute inset-0 z-20 flex flex-col text-left px-5 py-7">
                    <p className="text-[22px] m-0 leading-none">Join Our</p>
                    <p className="m-0 leading-none font-semibold text-[30px]">Faculty</p>
                    <p className="text-[16px] tracking-wider mt-4">We are hiring</p>
                    <p className="bg-white text-sla-blue text-[20px] w-fit px-2 py-1 font-semibold">{job.position} Teachers</p>
                    <p className="text-[16px]">{job.specialty}</p>
                </div>
                <div className="absolute inset-0 z-20 bg-black/50 opacity-0 hover:opacity-100 flex flex-col justify-end pb-5">
                    <p>Apply</p>
                </div>
            </div>   
            )}
        </div>
       
             
    );
}