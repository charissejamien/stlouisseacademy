
export default function StudentSummary() {
    return(
        <div className="bg-white px-10 py-5 rounded-md w-fit mt-5 hover:shadow-sm hover:-translate-y-1 hover:duration-300">
            <p className="text-sla-blue text-[20px] font-semibold">Alagbay, Charisse Jamien T.</p>
            <p className="text-sla-gray text-[14px]">Grade 5 - Amber</p>
            <div className="bg-background p-5 rounded-md mt-5 flex flex-col gap-1 items-center">
                <p className="text-sla-gray text-[12px] font-medium">ATTENDANCE STATUS</p>
                <p className="text-green-700 text-[24px] font-semibold">PRESENT</p>
                <p className="text-gray-700 text-[12px] font-medium">recorded at 6:30 am</p>
            </div>
            <div className="flex mt-3 justify-center">
                <button className="bg-sla-blue text-white text-[14px] p-2 rounded-sm ">View Student Details</button>
            </div>
        </div>
    );
}