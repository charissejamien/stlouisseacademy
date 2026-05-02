"use client";
import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { saveFees } from "./actions";
import toast from 'react-hot-toast';

export default function Fees() {

const tuitionFees = [ 
    {name: "tuitionPreElem", label: "Pre Elementary"},
    {name: "tuitionElem", label: "Elementary"},
    {name: "tuitionJHS", label: "Junior High School"}
];

const otherFees = [
    {name:"logo", label:"Logo"},
    {name:"upperCloth", label:"Upper Cloth"},
    {name:"lowerCloth", label:"lowerCloth"}
];

const mandatoryFees = [
    {name:"ssgMem", label:"SSG Membership"},
    {name:"studentPub", label:"Student Publication"},
    {name:"ptaMem", label:"PTA Membership"},
];

const [state, formAction] = useActionState(saveFees, {success:false, message:""})
useEffect(() => {
    if(state.message) {
        if(state.success) {
            toast.success(state.message);
        } else {
            toast.error(state.message);
        }
    }

}, [state]);




    return(
        <div className="p-20">
            <h2 className="text-[28px] font-semibold text-sla-blue">Fee Configuration</h2>

            <div>
                <form action={formAction} className="flex flex-col gap-10">
                    <div className="bg-white rounded-md p-5 flex flex-col gap-3 w-fit">
                        <p>Tuition Fees by Level</p>
                        {tuitionFees.map((item) => 
                        <div key={item.name} className="flex justify-between gap-10">
                            <label htmlFor={item.name} className="text-sla-blue font-medium">{item.label}</label>
                            <Input className="w-30 bg-background" name={item.name}/>
                        </div> 
                        )}
                    </div>

                    <div className="flex w-full gap-10">
                        <div className="bg-white rounded-md p-5 flex flex-col gap-3">
                            <p>Uniforms and Merch</p>
                            {otherFees.map((item) => 
                            <div key={item.name} className="flex justify-between gap-10">
                                <label htmlFor={item.name} className="text-sla-blue font-medium">{item.label}</label>
                                <Input className="w-30 bg-background" name={item.name}/>
                            </div>
                            )}
                        </div>
                        <div className="bg-white rounded-md p-5 flex flex-col gap-3">
                            <p>Mandatory Fees</p>
                            {mandatoryFees.map((item) => 
                            <div key={item.name} className="flex justify-between gap-10">
                                <label htmlFor={item.name} className="text-sla-blue font-medium">{item.label}</label>
                                <Input className="w-30 bg-background" name={item.name}/>
                            </div> 
                            )}
                        </div>
                    </div>

                    <button className="bg-sla-blue p-2 rounded-sm text-white w-[300]">Confirm Changes</button>
                </form>
            </div>
        </div>
    );
}