import { Button } from "@/components/ui/button";

export default function RegistrarDashboard() {
    return(
        <div className="mt-10">

            <section className="flex gap-10">
                <Button className="min-w-xs py-15">
                    Student Enrollment
                </Button>
                 <Button className="min-w-xs py-15">
                    Payments
                </Button>
                 <Button className="min-w-xs py-15">
                    Payroll
                </Button>
            </section>
            
        </div>
    );
}