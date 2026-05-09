import {GraduationCap , Users, LibraryBig} from 'lucide-react';


export default function ManagementSummary() {
    return(
        <div className="flex gap-5">
            <div className="bg-white px-20 py-5 rounded-md w-fit flex flex-col items-center shadow-xs hover:-translate-y-1 hover:duration-300">
                <GraduationCap size={60}/>
                <p className="text-[36px] font-semibold">421</p>
                <p>Students Enrolled</p>
            </div>

            <div className="bg-white px-20 py-5 rounded-md w-fit flex flex-col items-center shadow-xs hover:-translate-y-1 hover:duration-300">
                <Users size={60}/>
                <p className="text-[36px] font-semibold">27</p>
                <p>Employees</p>
            </div>

            <div className="bg-white px-20 py-5 rounded-md w-fit flex flex-col items-center shadow-xs hover:-translate-y-1 hover:duration-300">
                <LibraryBig size={60}/>
                <p className="text-[36px] font-semibold">17</p>
                <p>Sections</p>
            </div>
        </div>
    );
}