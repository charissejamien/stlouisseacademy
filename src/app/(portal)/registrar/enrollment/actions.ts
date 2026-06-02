"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { getEnrollmentEmailHtml } from "@/components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

interface DistributedPaymentItem {
    paymentSpecifics: string;
    amountPaid: number;
}

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
    paymentsDistributed: DistributedPaymentItem[];
}

interface EnrollmentPaymentInput {
    orNumber: string;
    paymentMethod: string;
}

interface SaveCompleteEnrollmentPayload {
    parentId: string; // Changed from number to string to support UUID strings
    students: EnrollmentStudentInput[];
    payment: EnrollmentPaymentInput;
}

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
        .eq('is_active', true);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function registerParent(
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    contactNumber: string
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('parents')
        .insert({
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email: email,
            contact_number: contactNumber
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getParents() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('parents')
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
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
                parent: parentId, // Links UUID string cleanly
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

        const { error: assessmentError } = await supabase
            .from("student_account_card")
            .insert({
                student_id: newStudent.id,
                school_year_id: activeSY.id,
                total_tuition_fee: student.tuitionTotal
            });

        if (assessmentError) throw new Error(`Failed to log initial assessment calculations: ${assessmentError.message}`);

        for (const paymentRow of student.paymentsDistributed) {
            const { error: paymentError } = await supabase
                .from("payments")
                .insert({
                    student_id: newStudent.id,    
                    or_number: payment.orNumber,
                    amount: paymentRow.amountPaid,
                    mode_of_payment: payment.paymentMethod
                });

            if (paymentError) throw new Error(`Failed to process distributed financial record entry: ${paymentError.message}`);
        }
    }

    // if (parent.email) {
    //     try {
    //         const combinedAmountPaid = students.reduce(
    //             (outerSum, s) => outerSum + s.paymentsDistributed.reduce((innerSum, p) => innerSum + p.amountPaid, 0), 0
    //         );

    //         const htmlContent = getEnrollmentEmailHtml({
    //             parentName: `${parent.first_name} ${parent.last_name}`,
    //             schoolYearLabel: `${activeSY.start_year}-${activeSY.end_year}`,
    //             students: students,
    //             orNumber: payment.orNumber,
    //             paymentMethod: payment.paymentMethod,
    //             paymentSpecifics: "Distributed Student Fees Summary",
    //             amountPaid: combinedAmountPaid,
    //         });

    //         await resend.emails.send({
    //             from: "St. Louisse Academy <onboarding@resend.dev>",
    //             to: [parent.email],
    //             subject: `Enrollment Confirmed - SY ${activeSY.start_year}-${activeSY.end_year}`,
    //             html: htmlContent,
    //         });
    //     } catch (emailError) {
    //         console.error("Resend API failed to ship confirmation email payload:", emailError);
    //     }
    // }

    return { success: true };
}

export async function getBillingPeriods() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("billing_periods").select("*") ;
    if (error) throw new Error(error.message);
    return data;
}

export async function saveBillingPeriod(periodName: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("billing_periods")
        .insert({ 
            period_name: periodName,
        });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteBillingPeriod(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("billing_periods").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
}






interface ParentInvitationPayload {
    email: string;
    firstName: string;
    lastName: string;
}

export async function inviteParentAccount({ email, firstName, lastName }: ParentInvitationPayload) {
    // We need the service_role client here because normal clients can't arbitrarily create/invite auth users
    const supabase = await createClient(); 

    // 1. Send an official Supabase Auth Invite
    // This automatically creates a user record in auth.users with a 'invited' status
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        email,
        {
            data: {
                first_name: firstName,
                last_name: lastName,
                role: "parent" // Custom metadata parameter to control page routing guards
            },
            // The URL the parent is redirected to after clicking the email link to set their password
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/set-password` 
        }
    );

    if (inviteError) {
        throw new Error(`Invitation Failed: ${inviteError.message}`);
    }

    return { success: true, user: inviteData.user };
}