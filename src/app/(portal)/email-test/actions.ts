"use server";

import EnrollmentEmail from "@/components/shared/enrollment-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailToUser(email: string, firstName: string) {
  const { data, error } = await resend.emails.send({
    from: "admin@send.sla.edu.ph",
    to: [email],
    subject: "Enrollment Confirmed",
    react: EnrollmentEmail({ firstName: firstName }),
  });

  if (error) {
    throw new Error(error.message);
  }
}
