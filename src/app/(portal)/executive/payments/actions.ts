// "use server";

// import { createClient } from "@/lib/supabase/server";

// export interface StudentBalanceProfile {
//     id: string;
//     firstName: string;
//     lastName: string;
//     gradeLevel: string;
//     totalTuition: number;
//     remainingTuitionBalance: number;
//     totalBooksFee: number;
//     remainingBooksBalance: number;
// }

// interface PaymentPayload {
//     student_id: string;
//     or_number: string;
//     amount: number;
//     mode_of_payment: string;
//     payment_specifics?: string;
// }

// export interface PaymentTransactionRecord {
//     id: string;
//     or_number: string;
//     payee_name: string;
//     created_at: string;
//     mode_of_payment: string;
//     amount: number;
// }

// interface SupabasePaymentJoinResult {
//     id: string;
//     or_number: string | null;
//     mode_of_payment: string | null;
//     amount: number | null;
//     created_at: string;
//     students: {
//         first_name: string;
//         last_name: string;
//         parents: {
//             first_name: string;
//             last_name: string;
//         } | null;
//     } | null;
// }

// export async function getStudentBalanceProfile(studentId: string): Promise<StudentBalanceProfile | null> {
//     const supabase = await createClient();

//     // Cleaned up formatting to prevent string parse engine breakdowns
//     const { data: student, error: studentError } = await supabase
//         .from("students")
//         .select(`
//             id,
//             first_name,
//             last_name,
//             enrollments (
//                 grade_level
//             ),
//             student_account_card (
//                 total_tuition_fee,
//                 total_books_fee
//             )
//         `)
//         .eq("id", studentId)
//         .single();

//     if (studentError || !student) {
//         console.error("Error fetching student balance metrics:", studentError);
//         return null;
//     }

//     // Pull past payments for this student
//     const { data: payments, error: paymentError } = await supabase
//         .from("payments")
//         .select("amount, payment_specifics")
//         .eq("student_id", studentId);

//     if (paymentError) throw new Error(paymentError.message);

//     const activeEnrollment = Array.isArray(student.enrollments) ? student.enrollments[0] : student.enrollments;
//     const accountCard = Array.isArray(student.student_account_card) ? student.student_account_card[0] : student.student_account_card;

//     const totalTuition = accountCard ? Number(accountCard.total_tuition_fee || 0) : 0;
//     const totalBooks = accountCard ? Number(accountCard.total_books_fee || 0) : 0;

//     // Filter payments into distinct buckets based on context notes
//     const tuitionPaid = (payments || [])
//         .filter(p => !p.payment_specifics?.toLowerCase().includes("book"))
//         .reduce((sum, p) => sum + Number(p.amount || 0), 0);

//     const booksPaid = (payments || [])
//         .filter(p => p.payment_specifics?.toLowerCase().includes("book"))
//         .reduce((sum, p) => sum + Number(p.amount || 0), 0);

//     return {
//         id: student.id,
//         firstName: student.first_name,
//         lastName: student.last_name,
//         gradeLevel: activeEnrollment?.grade_level || "Not Specified",
//         totalTuition: totalTuition,
//         remainingTuitionBalance: Math.max(0, totalTuition - tuitionPaid),
//         totalBooksFee: totalBooks,
//         remainingBooksBalance: Math.max(0, totalBooks - booksPaid)
//     };
// }

// /**
//  * 💾 Action 2: Batch commit student payment records directly
//  */
// export async function createStudentPayments(payments: PaymentPayload[]) {
//     const supabase = await createClient();

//     const { data, error } = await supabase
//         .from("payments")
//         .insert(payments)
//         .select();

//     if (error) throw new Error(error.message);
//     return data;
// }

// /**
//  * 📡 Action 3: Fetches recent global transactions with structural student fallback payee values
//  */
// export async function getRecentPayments(): Promise<PaymentTransactionRecord[]> {
//     const supabase = await createClient();

//     const { data, error } = await supabase
//         .from("payments")
//         .select(`
//             id,
//             or_number,
//             mode_of_payment,
//             amount,
//             created_at,
//             students (
//                 first_name,
//                 last_name,
//                 parents (
//                     first_name,
//                     last_name
//                 )
//             )
//         `)
//         .order("created_at", { ascending: false })
//         .limit(50);

//     if (error) {
//         console.error("Error inside getRecentPayments:", error);
//         throw new Error(`Failed to retrieve payments history: ${error.message}`);
//     }

//     if (!data) return [];

//     return (data as unknown as SupabasePaymentJoinResult[]).map((payment) => {
//     const studentInfo = payment.students;
//     const parentInfo = studentInfo?.parents;

//     // Dynamic fallback straight to student name if parent profile is absent
//     const compiledPayeeName = parentInfo
//         ? `${parentInfo.first_name} ${parentInfo.last_name}`
//         : studentInfo
//             ? `${studentInfo.first_name} ${studentInfo.last_name} (Student)`
//             : "Unknown Payer";

//     return {
//         id: payment.id,
//         or_number: payment.or_number || "N/A",
//         payee_name: compiledPayeeName,
//         created_at: payment.created_at,
//         mode_of_payment: payment.mode_of_payment || "Cash",
//         amount: Number(payment.amount || 0),
//         };
//     });
// }
