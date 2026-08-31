import AddPayment from "@/components/(portal)/payments/AddPayment";

export default function NewPayment() {
    return(
         <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden p-6">
            
            <div className="min-h-0 flex-1">
                <AddPayment />
            </div>

        </div>
    );
}   