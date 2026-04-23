"use client"
import { useActionState } from "react";
import { saveStudentInfo } from "../actions";


export default function Test() {

    const [state, formAction] = useActionState(saveStudentInfo, {success:false});


    return (
        <form action={formAction} className="m-10 flex gap-5">

            <input type="text" name="firstName" placeholder="First Name" className="border border-black p-2"/>
            <input type="text" name="middleName" placeholder="Middle Name" className="border border-black p-2"/>
            <input type="text" name="lastName" placeholder="Last Name" className="border border-black p-2"/>
            
            <button type="submit">Save Info</button>
            {state.success && <p className="text-green-500">Student Saved!</p>}
        </form>

        
    );
}