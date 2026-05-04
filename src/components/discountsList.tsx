
import { getDiscount } from "@/app/admin/fees/actions";
import {Pencil} from 'lucide-react'
import { DeleteButton } from "./DeleteButton";

export default async function DiscountsList() {

const discounts = await getDiscount();

const headings = ["Discount Specification", "Amount", "Actions"]


if(!discounts) return <p>No fees</p>;

    return(
        <div className="w-[80%] mx-auto">
            <p>Current Discounts List</p>

            <div className="bg-white py-5 px-10">
                <div className="flex justify-between">
                    {headings.map((item) => (
                        <p key={item}>{item}</p>
                    ))}
                </div>
                <div className="">
                    {discounts.map((fee) =>(
                    <div key={fee.id} className="flex justify-between">
                        <p className="text-black]">{fee.name}</p>
                        <p>{fee.amount}</p>
                        <div className="flex gap-2">
                            <Pencil size={16}/>
                            <DeleteButton id={fee.id}/>
                        </div>
                    </div>
                    ))}
                </div>

                <div>
                    
                </div>
            </div>
            
        </div>
    );
}