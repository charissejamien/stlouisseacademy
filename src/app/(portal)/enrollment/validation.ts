import { z } from "zod";

export const studentSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string(),
    lastName: z.string().min(1, "Last name is required"),
    suffix: z.string(),
    address: z.string().min(1, "Address is required"),
    // dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    schoolYear: z.string().min(1, "School year is required"),
    gradeLevel: z.string().min(1, "Grade level is required"),
    studentType: z.string().min(1, "Student type is required"),
});

export const studentsSchema = z.array(studentSchema);