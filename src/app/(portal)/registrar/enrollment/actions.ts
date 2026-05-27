"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { getEnrollmentEmailHtml } from "@/components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function generateStudentId() {

    const year = new Date().getFullYear().toString();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("students")
        .select("student_id")
        .like("student_id", `${year}%`)
        .order("student_id", { ascending: false })
        .limit(1);

    if (error) {
        throw error;
    }

    let nextNumber = 1;
 
    if (data && data.length > 0) {

        const latestId = data[0].student_id;
        const latestNumber = parseInt(latestId.slice(4));
        nextNumber = latestNumber + 1;
    }

    const paddedNumber = String(nextNumber).padStart(4, "0");

    return `${year}${paddedNumber}`;
}

export async function getActiveSchoolYear() {
    const supabase = await createClient();

    const { data, error } = await supabase
    .from('school_years')
    .select('*')
    .eq('is_active', true)

    if(error) {
        throw new Error(error.message);
    }

    return data
}


export async function registerParent(
    firstName: string,
    middleName: string,
    lastName:string,
    email:string,
    contactNumber:string
    ) 
{
    const supabase = await createClient();

    const {data,error} = await supabase
    .from('parents')
    .insert({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: email,
        contact_number: contactNumber
    })
    .select()
    .single()

    if (error) {
        throw new Error(error.message)
    }

    return data;
}

export async function getParents() {
    const supabase = await createClient();

    const {data,error} = await supabase
    .from('parents')
    .select('*')

    if (error) {
        throw new Error(error.message)
    }

    return data
}

// 1. Keep this the same — it now holds each student's specific breakdown
interface EnrollmentStudentInput {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    gradeLevel: string;
    studentType: string;
    tuitionTotal: number;
    bookTotal: number;
    paymentSpecifics: string;  // Correctly mapped per student row
    amountPaid: number;        // Correctly mapped per student row
}

// 2. Change this to ONLY require the shared receipt meta fields
interface EnrollmentPaymentInput {
    orNumber: string;
    paymentMethod: string;
}

// 3. This stays neat and consistent
interface SaveCompleteEnrollmentPayload {
    parentId: number;
    students: EnrollmentStudentInput[];
    payment: EnrollmentPaymentInput; // Will now cleanly accept your object 
}

export async function getTuitionFees() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("tuition_fees").select("*");
    if (error) throw new Error(error.message);
    return data;
}

export async function getBooks() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("books").select("*");
    if (error) throw new Error(error.message);
    return data;
}

export async function saveCompleteEnrollment({ parentId, students, payment }: SaveCompleteEnrollmentPayload) {
    const supabase = await createClient();

    const { data: parent, error: parentError } = await supabase
        .from("parents")
        .select("first_name, last_name, email")
        .eq("id", parentId)
        .single();

    if (parentError || !parent) {
        throw new Error("Could not find parent profile for email routing configuration.");
    }

    const { data: activeSY, error: syError } = await supabase
        .from("school_years")
        .select("id, start_year, end_year")
        .eq("is_active", true)
        .single();

    if (syError || !activeSY) {
        throw new Error("Could not find active school year for reference.");
    }

    const baseGeneratedId = await generateStudentId();
    const currentYearPrefix = new Date().getFullYear().toString();
    let sequenceCounter = parseInt(baseGeneratedId.slice(4));

    for (const student of students) {
        const paddedSequence = String(sequenceCounter).padStart(4, "0");
        const uniqueStudentId = `${currentYearPrefix}${paddedSequence}`;
        sequenceCounter++;

        const { data: newStudent, error: studentError } = await supabase
            .from("students")
            .insert({
                parent: parentId,
                student_id: uniqueStudentId,
                first_name: student.firstName,
                middle_name: student.middleName || null,
                last_name: student.lastName,
                date_of_birth: student.dateOfBirth,
                gender: student.gender
            })
            .select("id")
            .single();

        if (studentError) throw new Error(`Failed to save student profile: ${studentError.message}`);

        const { error: enrollmentError } = await supabase
            .from("enrollments")
            .insert({
                student_id: newStudent.id,
                school_year_id: activeSY.id,
                grade_level: student.gradeLevel,
                student_type: student.studentType,
                status: "Enrolled"
            });

        if (enrollmentError) throw new Error(`Failed to write enrollment context: ${enrollmentError.message}`);

        const totalNetDue = student.tuitionTotal + student.bookTotal;
        const initialPaymentStatus = student.amountPaid >= totalNetDue ? "Fully Paid" : "Partially Paid";

        const { data: newAssessment, error: assessmentError } = await supabase
            .from("student_account_card")
            .insert({
                student_id: newStudent.id,
                school_year_id: activeSY.id,
                total_tuition_fee: student.tuitionTotal,
                // total_discounts: 0.00,
                // net_amount_due: totalNetDue,
                // payment_status: initialPaymentStatus
            })
            .select("id")
            .single();

        if (assessmentError) throw new Error(`Failed to log initial assessment calculations: ${assessmentError.message}`);

        const { error: paymentError } = await supabase
            .from("payments")
            .insert({
                // fee_assessment_id: newAssessment.id,
                or_number: payment.orNumber,
                amount: student.amountPaid,
                mode_of_payment: payment.paymentMethod
            });

        if (paymentError) throw new Error(`Failed to process distributed financial record entry: ${paymentError.message}`);
    }

    if (parent.email) {
        try {
            const combinedAmountPaid = students.reduce((sum, s) => sum + s.amountPaid, 0);

            const htmlContent = getEnrollmentEmailHtml({
                parentName: `${parent.first_name} ${parent.last_name}`,
                schoolYearLabel: `${activeSY.start_year}-${activeSY.end_year}`,
                students: students,
                orNumber: payment.orNumber,
                paymentMethod: payment.paymentMethod,
                paymentSpecifics: "Distributed Student Fees Summary",
                amountPaid: combinedAmountPaid,
            });

            await resend.emails.send({
                from: "St. Louis Academy <onboarding@resend.dev>",
                to: [parent.email],
                subject: `Enrollment Confirmed - SY ${activeSY.start_year}-${activeSY.end_year}`,
                html: htmlContent,
            });
        } catch (emailError) {
            console.error("Resend API failed to ship confirmation email payload:", emailError);
        }
    }

    return { success: true };
}