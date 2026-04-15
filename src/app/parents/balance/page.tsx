import PaymentHistory from '@/components/paymentHistory';
import {Wallet} from 'lucide-react';


export default function Balance() {



    return(
        <div className="w-[90%] mx-auto mt-20 flex flex-col gap-7">

            {/* Account Balance Summary */}
            <div className='flex flex-col gap-1'>
                <div className="flex items-center justify-between">
                    <h2 className='font-semibold text-[20px]'>Account Balance</h2>
                    <h2 className='text-sla-blue font-medium'>SY 2025-2026</h2>
                </div>
                <p className='text-[14px]'>Financial Summary for Charisse Jamien Alagbay</p>

                <div className="w-full bg-sla-blue text-white p-8 pb-15 mt-2 rounded-xl">
                    <p className="text-[#C9D5E3] text-sm">CURRENT BALANCE</p>
                    <h2 className="text-[40px] font-bold">P17,720.00</h2>
                </div>

                <div className="flex gap-3 mt-3">
                    <div className="bg-white p-5 flex flex-col gap-1 rounded-xl grow">
                        <p className="text-sla-blue text-[14px] font-semibold">LAST PAYMENT</p>
                        <p className="text-[20px] font-bold">P1,501.00</p>
                        <p className="text-sla-gray text-[12px]">Mar 12, 2026</p>
                    </div>
                    <div className="bg-white p-5 flex flex-col gap-1 rounded-xl grow">
                        <p className="text-sla-blue text-[14px] font-semibold">LAST PAYMENT</p>
                        <p className="text-[20px] font-bold">P1,501.00</p>
                        <p className="text-sla-gray text-[12px]">Mar 12, 2026</p>
                    </div>
                </div>
            </div>

            {/* School Fees Breakdown */}
            <div className='flex flex-col gap-3'>
                <p className='font-medium text-[18px]'>School Fees Breakdown</p>
                <div className="bg-white p-5 rounded-xl flex flex-col gap-3">
                    <div>
                        <div className='flex justify-between'>
                            <p className="font-bold">Tuition Fee</p>
                            <p>P18,950.00</p>
                        </div>
                        <div className='flex justify-between'> 
                            <p className="font-medium text-sla-gray text-xs">Tuition</p>
                            <p className="text-sla-gray text-xs">P9,800.00</p>
                        </div>
                        <div className='flex justify-between'> 
                            <p className="font-medium text-sla-gray text-xs">Miscellaneous</p>
                            <p className="text-sla-gray text-xs">P9,150.00</p>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <p className="font-bold">Books</p>
                        <p>P17,500.00</p>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <PaymentHistory/>
        </div>
    );
}