"use client";
import {Wallet} from 'lucide-react';
import { useState } from 'react';

export default function PaymentHistory() {

const paymentFilters = ["All", "Tuition", "Books", "Others"]
const [state, setState] = useState("All");

    return(
                    <div className='flex flex-col gap-3'>
                <p className='font-medium text-[18px]'>Payment History</p>
                <div className="flex gap-2">
                    {paymentFilters.map((item) => (
                        <button key={item} onClick={()=>setState(item)} className={`${state===item?"bg-sla-blue text-white":"bg-white"} px-4 py-1 text-[14px] rounded-sm`}>{item}</button>
                    ))}
                </div>
                <div className="bg-white flex py-6 rounded-xl gap-7 w-full px-3">
                    <div className=' w-[10%]'>
                        <button className='bg-blue-200 rounded-[50%] p-3'><Wallet size={24}/></button>
                    </div>
                    <div className='w-[90%] flex flex-col'> 
                        <div className='flex  justify-between'>
                            <p className='text-[20px] font-semibold'>Mar 31, 2026</p>
                            <p className='text-[20px] font-semibold text-sla-blue'>P1,200.00</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>OR:66411</p>
                            <p className='text-[#037609] bg-[#AFF39C] py-1 px-2 text-xs font-medium rounded-sm'>Cash</p>
                        </div>
                    </div>
                </div>
            </div>
    );
}