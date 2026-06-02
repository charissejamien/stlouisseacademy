interface StudentRowInput {
    firstName: string;
    lastName: string;
    gradeLevel: string;
    studentType: string;
}

interface EnrollmentEmailProps {
    parentName: string;
    schoolYearLabel: string;
    students: StudentRowInput[];
    orNumber: string;
    paymentMethod: string;
    paymentSpecifics: string;
    amountPaid: number;
}

export function getEnrollmentEmailHtml({
    parentName,
    schoolYearLabel,
    students,
    orNumber,
    paymentMethod,
    paymentSpecifics,
    amountPaid,
}: EnrollmentEmailProps): string {
    const studentRowsHtml = students
        .map(
            (s) => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e293b;">${s.firstName} ${s.lastName}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #475569;">${s.gradeLevel}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #475569;">${s.studentType}</td>
        </tr>
    `
        )
        .join("");

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #1e3a8a; margin-bottom: 4px;">Enrollment Successful!</h2>
            <p style="color: #475569; font-size: 16px; margin-top: 0;">Dear ${parentName},</p>
            <p style="color: #334155; line-height: 1.5;">We are pleased to inform you that your student enrollment for <strong>School Year ${schoolYearLabel}</strong> have been processed successfully.</p>
            
            <h3 style="color: #1e3a8a; margin-top: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">Enrolled Student Summary</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                <thead>
                    <tr style="background-color: #f8fafc;">
                        <th style="padding: 12px; color: #64748b;">Student Name</th>
                        <th style="padding: 12px; color: #64748b;">Grade Level</th>
                        <th style="padding: 12px; color: #64748b;">Type</th>
                    </tr>
                </thead>
                <tbody>
                    ${studentRowsHtml}
                </tbody>
            </table>

            <h3 style="color: #1e3a8a; margin-top: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">Initial Transaction Receipt</h3>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; font-size: 14px; color: #334155; line-height: 1.6;">
                <div><strong>Official Receipt (OR) Number:</strong> ${orNumber}</div>
                <div><strong>Payment Method:</strong> ${paymentMethod}</div>
                <div><strong>Payment Allocation:</strong> ${paymentSpecifics}</div>
                <div><strong>Amount Paid:</strong> ₱${amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>

            <p style="color: #64748b; font-size: 12px; margin-top: 32px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                This is an automated notification from the St. Louisse Academy Registrar Portal. Please do not reply directly to this message.
            </p>
        </div>
    `;
}