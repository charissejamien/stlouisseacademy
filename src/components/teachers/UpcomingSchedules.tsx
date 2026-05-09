import {Clock} from 'lucide-react';

export default function UpcomingSchedules() {
    return(
        <div className='ml-5 flex flex-col gap-3'>
            <p>This Week</p>
            <div className='flex gap-5'>
                <div className="bg-white p-5 rounded-md w-fit">
                    <p>May 12, 2026 | Monday</p>
                    <p className="text-[12px] text-red-500">3 days from now</p>
                    <p className="text-[18px] font-semibold px-10 py-3">GRADE SUBMISSIONS</p>
                    <div className='flex gap-1 items-center'>
                        <Clock size={14}/>
                        <p className="text-[14px]">4:00 PM</p>
                    </div>
                    <p></p>
                </div>
                <div className="bg-white p-5 rounded-md w-fit">
                    <p>May 15, 2026 | Thursday</p>
                    <p className="text-[12px] text-red-500">6 days from now</p>
                    <p className="text-[18px] font-semibold px-10 py-3">GENERAL PTA MEETING</p>
                    <div className='flex gap-1 items-center'>
                        <Clock size={14}/>
                        <p className="text-[14px]">1:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
}