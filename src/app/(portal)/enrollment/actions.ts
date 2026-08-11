// "use server";

// import { createClient } from "@/lib/supabase/server";

// export interface RapidEnrollmentPayload {
//     studentIdNumber: string; 
//     firstName: string;
//     lastName: string;
//     gradeLevel: string;
//     enrollmentFeePaid: number;
//     tuitionTotalAssessment: number;
//     booksTotalAssessment: number;
// }

// export async function rapidEnrollStudent(payload: RapidEnrollmentPayload) {
//     const supabase = await createClient();

//     // 1. Fetch the institutional runtime timeline to ensure proper relation binding
//     const { data: activeSY, error: syError } = await supabase
//         .from("school_years")
//         .select("id")
//         .eq("is_active", true)
//         .single();

//     if (syError || !activeSY) {
//         throw new Error("Could not find an active school year for baseline financial routing reference.");
//     }

//     const targetTimestamp = new Date().toISOString();

//     // 2. Insert the student row with zero parent or hardware requirements
//     const { data: student, error: studentError } = await supabase
//         .from("students")
//         .insert({
//             student_id: payload.studentIdNumber.trim(),
//             first_name: payload.firstName.trim(),
//             last_name: payload.lastName.trim(),
//             parent: null,         // Explicitly unlinked for staging mode
//             created_at: targetTimestamp 
//         })
//         .select("id")
//         .single();

//     if (studentError || !student) {
//         console.error("Failed rapid student insertion:", studentError);
//         throw new Error(`Directory insertion failed: ${studentError?.message || "Record not returned"}`);
//     }

//     // 3. Log the historical enrollment context mapping metadata row
//     const { error: enrollmentError } = await supabase
//         .from("enrollments")
//         .insert({
//             student_id: student.id,
//             school_year_id: activeSY.id,
//             grade_level: payload.gradeLevel,
//             student_type: "Regular",
//             status: "Enrolled",
//             created_at: targetTimestamp
//         });

//     if (enrollmentError) {
//         throw new Error(`Student profile saved, but active enrollment block context failed: ${enrollmentError.message}`);
//     }

//     // 4. 🚀 CRITICAL FIX: Initialize the complete structural fee balance accounting card ledger
//     const { error: assessmentError } = await supabase
//         .from("student_account_card")
//         .insert({
//             student_id: student.id,
//             school_year_id: activeSY.id,
//             total_tuition_fee: payload.tuitionTotalAssessment,
//             total_books_fee: payload.booksTotalAssessment, // ✅ Saved safely to database layout column framework
//             created_at: targetTimestamp 
//         });

//     if (assessmentError) {
//         throw new Error(`Student created, but initial billing profile parameters failed to bind: ${assessmentError.message}`);
//     }

//     // 5. Log the accompanying financial remittance parameter
//     const { error: paymentError } = await supabase
//         .from("payments") 
//         .insert({
//             student_id: student.id,
//             amount: payload.enrollmentFeePaid,
//             mode_of_payment: "Cash",
//             or_number: `OR-MIG-${payload.studentIdNumber.trim()}`, // Distinguishable migration identification string tag
//             billing_period: "Downpayment / Enrollment Fee",
//             payment_specifics: "Initial Rapid Enrollment Remittance Verification",
//             created_at: targetTimestamp
//         });

//     if (paymentError) {
//         console.error("Failed to log accompanying financial record:", paymentError);
//         throw new Error(`Student baseline profile committed, but payment ledger write failed: ${paymentError.message}`);
//     }

//     return { success: true };
// }

// export async function linkStudentsToParent(studentIds: string[], parentId: string) {
//     const supabase = await createClient();

//     if (!studentIds || studentIds.length === 0) {
//         throw new Error("No student records selected for linking.");
//     }

//     const { error } = await supabase
//         .from("students")
//         .update({ parent: parentId }) // Verified reference match name
//         .in("id", studentIds); 

//     if (error) {
//         console.error("Failed batch parent reconciliation write:", error);
//         throw new Error(`Reconciliation failed: ${error.message}`);
//     }

//     return { success: true };
// }

// export async function getStagedStudents() {
//     const supabase = await createClient();

//     const { data, error } = await supabase
//         .from("students")
//         .select("id, first_name, last_name")
//         .is("parent", null);

//     if (error) {
//         console.error("Server-side staging fetch failed:", error);
//         throw new Error(error.message);
//     }

//     return data || [];
// }

// import { Resend } from "resend";
// import { getEnrollmentEmailHtml } from "@/components/EmailTemplate";
// import { revalidatePath } from "next/cache";

// const resend = new Resend(process.env.RESEND_API_KEY);

// interface DistributedPaymentItem {
//     paymentSpecifics: string;
//     amountPaid: number;
// }

// interface EnrollmentStudentInput {
//     firstName: string;
//     middleName?: string;
//     lastName: string;
//     dateOfBirth: string;
//     gender: string;
//     gradeLevel: string;
//     studentType: string;
//     tuitionTotal: number;
//     bookTotal: number;
//     backdatedEnrollmentDate?: string;
//     paymentsDistributed: DistributedPaymentItem[];
// }

// interface EnrollmentPaymentInput {
//     orNumber: string;
//     paymentMethod: string;
// }

// interface SaveCompleteEnrollmentPayload {
//     parentId: string; 
//     students: EnrollmentStudentInput[];
//     payment: EnrollmentPaymentInput;
// }

// export async function generateStudentId() {
//     const year = new Date().getFullYear().toString();
//     const supabase = await createClient();

//     const { data, error } = await supabase
//         .from("students")
//         .select("student_id")
//         .like("student_id", `${year}%`)
//         .order("student_id", { ascending: false })
//         .limit(1);

//     if (error) {
//         throw error;
//     }

//     let nextNumber = 1;
 
//     if (data && data.length > 0) {
//         const latestId = data[0].student_id;
//         const latestNumber = parseInt(latestId.slice(4));
//         nextNumber = latestNumber + 1;
//     }

//     const paddedNumber = String(nextNumber).padStart(4, "0");
//     return `${year}${paddedNumber}`;
// }

// export async function getActiveSchoolYear() {
//     const supabase = await createClient();

//     const { data, error } = await supabase
//         .from('school_years')
//         .select('*')
//         .eq('is_active', true);

//     if (error) {
//         throw new Error(error.message);
//     }

//     return data;
// }

// export async function registerParent(
//     firstName: string,
//     middleName: string,
//     lastName: string,
//     email: string,
//     contactNumber: string
// ) {
//     const supabase = await createClient();

//     const { data, error } = await supabase
//         .from('parents')
//         .insert({
//             first_name: firstName,
//             middle_name: middleName,
//             last_name: lastName,
//             email: email,
//             contact_number: contactNumber
//         })
//         .select()
//         .single();

//     if (error) {
//         throw new Error(error.message);
//     }

//     return data;
// }

// export async function getParents() {
//     const supabase = await createClient();

//     const { data, error } = await supabase
//         .from('parents')
//         .select('*');

//     if (error) {
//         throw new Error(error.message);
//     }

//     return data;
// }

// export async function getTuitionFees() {
//     const supabase = await createClient();
//     const { data, error } = await supabase.from("tuition_fees").select("*");
//     if (error) throw new Error(error.message);
//     return data;
// }

// export async function getBooks() {
//     const supabase = await createClient();
//     const { data, error } = await supabase.from("books").select("*");
//     if (error) throw new Error(error.message);
//     return data;
// }

// export async function saveCompleteEnrollment({ parentId, students, payment }: SaveCompleteEnrollmentPayload) {
//     const supabase = await createClient();
//     let parent = null;

//     // Check if running in Executive Staging Bypass Mode
//     const isStagingMode = parentId === "staging-unlinked-parent-id";

//     if (isStagingMode) {
//         parent = {
//             first_name: "Staging",
//             last_name: "Unlinked Parent",
//             email: null
//         };
//     } else {
//         const { data: realParent, error: parentError } = await supabase
//             .from("parents")
//             .select("first_name, last_name, email")
//             .eq("id", parentId)
//             .single();

//         if (parentError || !realParent) {
//             throw new Error("Could not find parent profile for email routing configuration.");
//         }
//         parent = realParent;
//     }

//     const { data: activeSY, error: syError } = await supabase
//         .from("school_years")
//         .select("id, start_year, end_year")
//         .eq("is_active", true)
//         .single();

//     if (syError || !activeSY) {
//         throw new Error("Could not find active school year for reference.");
//     }

//     const baseGeneratedId = await generateStudentId();
//     const currentYearPrefix = new Date().getFullYear().toString();
//     let sequenceCounter = parseInt(baseGeneratedId.slice(4));

//     for (const student of students) {
//         const paddedSequence = String(sequenceCounter).padStart(4, "0");
//         const uniqueStudentId = `${currentYearPrefix}${paddedSequence}`;
//         sequenceCounter++;

//         // ✅ FIX: Verify backdated string has actual content and isn't an empty string ""
//         const hasBackdateOverride = student.backdatedEnrollmentDate && student.backdatedEnrollmentDate.trim() !== "";
        
//         // If it's an empty string or null, default directly to system now() to satisfy database constraints
//         const targetTimestamp = hasBackdateOverride 
//             ? new Date(student.backdatedEnrollmentDate!).toISOString()
//             : new Date().toISOString();

//         // ✅ FIX: Convert empty string birthdates directly to valid database NULL markers
//         const sanitizedDateOfBirth = student.dateOfBirth && student.dateOfBirth.trim() !== "" 
//             ? student.dateOfBirth 
//             : null;

//         // Save the profile
//         const { data: newStudent, error: studentError } = await supabase
//             .from("students")
//             .insert({
//                 parent: isStagingMode ? null : parentId, 
//                 student_id: uniqueStudentId,
//                 first_name: student.firstName,
//                 middle_name: student.middleName || null,
//                 last_name: student.lastName,
//                 date_of_birth: sanitizedDateOfBirth, 
//                 gender: student.gender,
//                 created_at: targetTimestamp 
//             })
//             .select("id")
//             .single();

//         if (studentError) throw new Error(`Failed to save student profile: ${studentError.message}`);

//         // Save the enrollment ledger record row
//         const { error: enrollmentError } = await supabase
//             .from("enrollments")
//             .insert({
//                 student_id: newStudent.id,
//                 school_year_id: activeSY.id,
//                 grade_level: student.gradeLevel,
//                 student_type: student.studentType,
//                 status: "Enrolled",
//                 created_at: targetTimestamp 
//             });

//         if (enrollmentError) throw new Error(`Failed to write enrollment context: ${enrollmentError.message}`);

//         // Save initial account card assessment calculation records
//         const { error: assessmentError } = await supabase
//             .from("student_account_card")
//             .insert({
//                 student_id: newStudent.id,
//                 school_year_id: activeSY.id,
//                 total_tuition_fee: student.tuitionTotal,
//                 total_books_fee: student.bookTotal,
//                 created_at: targetTimestamp 
//             });

//         if (assessmentError) throw new Error(`Failed to log initial assessment calculations: ${assessmentError.message}`);

//         // Save payments distributed loop logs
//         for (const paymentRow of student.paymentsDistributed) {
//             const { error: paymentError } = await supabase
//                 .from("payments")
//                 .insert({
//                     student_id: newStudent.id,    
//                     or_number: payment.orNumber,
//                     amount: paymentRow.amountPaid,
//                     mode_of_payment: payment.paymentMethod,
//                     created_at: targetTimestamp ,
//                     payment_specifics: paymentRow.paymentSpecifics
//                 });

//             if (paymentError) throw new Error(`Failed to process distributed financial record entry: ${paymentError.message}`);
//         }
//     }

//     if (!isStagingMode && parent.email) {
//         try {
//             const combinedAmountPaid = students.reduce(
//                 (outerSum, s) => outerSum + s.paymentsDistributed.reduce((innerSum, p) => innerSum + p.amountPaid, 0), 0
//             );

//             const htmlContent = getEnrollmentEmailHtml({
//                 parentName: `${parent.first_name} ${parent.last_name}`,
//                 schoolYearLabel: `${activeSY.start_year}-${activeSY.end_year}`,
//                 students: students,
//                 orNumber: payment.orNumber,
//                 paymentMethod: payment.paymentMethod,
//                 paymentSpecifics: "Distributed Student Fees Summary",
//                 amountPaid: combinedAmountPaid,
//             });

//             await resend.emails.send({
//                 from: "St. Louisse Academy <onboarding@resend.dev>",
//                 to: [parent.email],
//                 subject: `Enrollment Confirmed - SY ${activeSY.start_year}-${activeSY.end_year}`,
//                 html: htmlContent,
//             });
//         } catch (emailError) {
//             console.error("Resend API failed to ship confirmation email payload:", emailError);
//         }
//     }

//     return { success: true };
// }

// export async function getBillingPeriods() {
//     const supabase = await createClient();
//     const { data, error } = await supabase.from("billing_periods").select("*") ;
//     if (error) throw new Error(error.message);
//     return data;
// }

// export async function saveBillingPeriod(periodName: string) {
//     const supabase = await createClient();

//     const { data, error } = await supabase
//         .from("billing_periods")
//         .insert({ 
//             period_name: periodName,
//         });

//     if (error) {
//         throw new Error(error.message);
//     }

//     return data;
// }

// export async function deleteBillingPeriod(id: string) {
//     const supabase = await createClient();
//     const { error } = await supabase.from("billing_periods").delete().eq("id", id);
//     if (error) throw new Error(error.message);
//     return { success: true };
// }

// interface ParentInvitationPayload {
//     email: string;
//     firstName: string;
//     lastName: string;
// }

// export async function inviteParentAccount(email: string, firstName: string, lastName: string) {
//   const supabase = await createClient();

//   const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
//     email.trim().toLowerCase(),
//     {
//       data: {
//         first_name: firstName,
//         last_name: lastName,
//         role: "parent",
//       },
//       redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/setup-account?email=${encodeURIComponent(email)}`,
//     }
//   );

//   if (inviteError) {
//     throw new Error(`Auth invitation failed: ${inviteError.message}`);
//   }

//   return inviteData.user;

  
// }

// interface StudentPayload {
//   first_name: string;
//   last_name: string;
//   grade_level: string;
// }

// interface EnrollmentPayload {
//   parent_email: string;
//   parent_first_name: string;
//   parent_last_name: string;
//   students: StudentPayload[];
// }

// export async function submitRegistrarEnrollment(data: EnrollmentPayload) {
//   const supabase = await createClient();

//   try {
//     const parentUser = await inviteParentAccount(
//       data.parent_email,
//       data.parent_first_name,
//       data.parent_last_name
//     );

//     const { data: parentProfile, error: profileError } = await supabase
//       .from("parents")
//       .upsert({
//         id: parentUser.id,
//         email: data.parent_email.trim().toLowerCase(),
//         first_name: data.parent_first_name,
//         last_name: data.parent_last_name,
//       })
//       .select()
//       .single();

//     if (profileError) throw profileError;

//     const studentsToInsert = data.students.map((student) => ({
//       first_name: student.first_name,
//       last_name: student.last_name,
//       grade_level: student.grade_level,
//       parent_id: parentProfile.id,
//     }));

//     const { error: studentError } = await supabase
//       .from("students")
//       .insert(studentsToInsert);

//     if (studentError) throw studentError;

//     revalidatePath("/registrar/enrollment");
//     return { success: true };

//   } catch (error: any) {
//     console.error("Enrollment process interruption:", error);
//     return { 
//       success: false, 
//       message: error.message || "Failed to process enrollment records." 
//     };
//   }
// }