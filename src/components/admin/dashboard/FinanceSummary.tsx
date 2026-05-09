
export default function FinanceSummary() {
    return(
        <div className="flex gap-5">
            <div className="bg-white p-5 rounded-md shadow-xs">
                <p className="text-[14px] text-sla-gray">Total Collectibles</p>
                <div>
                    <p className="text-[30px] font-semibold px-5">P457,832.00</p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-md shadow-xs">
                <p className="text-[14px] text-sla-gray">Total Collected</p>
                <div>
                    <p className="text-[30px] font-semibold px-5">P897,532.00</p>
                </div>
            </div>

           <div className="bg-white p-5 rounded-md shadow-xs">
                <p className="text-[14px] text-sla-gray">Total Expenses</p>
                <div>
                    <p className="text-[30px] font-semibold px-5">P143,832.00</p>
                </div>
            </div>
        </div>
    );
}