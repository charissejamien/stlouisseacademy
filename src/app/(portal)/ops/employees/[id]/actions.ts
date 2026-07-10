// app/(portal)/ops/employees/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

interface RFIDAssignmentPayload {
  id: string;
  rfidTagId: string;
}

export async function getEmployeeProfile(employeeIdUUID: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .select(`
      id,
      employee_id,
      first_name,
      last_name,
      email,
      profile,
      is_active,
      contact_number,
      gender,
      date_of_birth,
      sss_number,
      philhealth_number,
      pagibig_number,
      tin_number,
      rfid,
      employee_assignments (
        role_title,
        department,
        employment_status,
        contract_start_date,
        contract_end_date,
        contract_length_months
      )
    `)
    .eq("id", employeeIdUUID)
    .single();

  if (error || !data) {
    throw new Error(`Failed to isolate active personnel profile dossier: ${error?.message || "Record not found"}`);
  }

  const activeAssignment = Array.isArray(data.employee_assignments)
    ? data.employee_assignments[0]
    : data.employee_assignments;

  return {
    id: data.id,
    employee_id: data.employee_id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    profile: data.profile,
    is_active: data.is_active,
    contact_number: data.contact_number,
    gender: data.gender,
    date_of_birth: data.date_of_birth,
    sss_number: data.sss_number,
    philhealth_number: data.philhealth_number,
    pagibig_number: data.pagibig_number,
    tin_number: data.tin_number,
    rfid_tag: data.rfid,
    role_title: activeAssignment?.role_title || "Unassigned Position Track",
    department: activeAssignment?.department || "General Operations",
    employment_status: activeAssignment?.employment_status || "Regular Track",
    contract_start_date: activeAssignment?.contract_start_date,
    contract_end_date: activeAssignment?.contract_end_date,
    contract_length_months: activeAssignment?.contract_length_months,
  };
}


interface RFIDAssignmentPayload {
  id: string;
  rfidTagId: string;
}

export async function assignEmployeeRFID({ id, rfidTagId }: RFIDAssignmentPayload) {
  const supabase = await createClient();
  const cleanTagId = rfidTagId.trim();

  if (!cleanTagId) {
    throw new Error("Hardware scanning data validation drop: Tag data string is empty.");
  }

  const { data: existingStudentCard, error: studentQueryError } = await supabase
    .from("students")
    .select("id, first_name, last_name")
    .eq("rfid", cleanTagId)
    .maybeSingle();

  if (studentQueryError) {
    throw new Error(`Failed to run hardware cross-verification query: ${studentQueryError.message}`);
  }

  if (existingStudentCard) {
    const studentName = `${existingStudentCard.last_name}, ${existingStudentCard.first_name}`;
    throw new Error(`This RFID card is already assigned to student: ${studentName}.`);
  }

  const { data: existingEmployeeCard, error: employeeQueryError } = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .eq("rfid", cleanTagId)
    .neq("id", id)
    .maybeSingle();

  if (employeeQueryError) {
    throw new Error(`Failed to run staff validation query: ${employeeQueryError.message}`);
  }

  if (existingEmployeeCard) {
    const employeeName = `${existingEmployeeCard.last_name}, ${existingEmployeeCard.first_name}`;
    throw new Error(`This RFID card is already assigned to employee: ${employeeName}.`);
  }

  const { error: updateError } = await supabase
    .from("employees")
    .update({ rfid: cleanTagId })
    .eq("id", id);

  if (updateError) {
    throw new Error(`Hardware routing registration failed: ${updateError.message}`);
  }

  return { success: true };
}


export async function uploadEmployeeAvatar(employeeIdUUID: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No asset image chunk found inside execution payloads.");
  }

  try {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file format. Please upload a JPG, PNG, or WebP image.");
    }

    if (file.size > 3 * 1024 * 1024) {
      throw new Error("File size restriction blown. Images must be smaller than 3MB.");
    }

    const fileExtension = file.name.split(".").pop() || "png";
    const filePath = `employees/${employeeIdUUID}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(`Bucket pipeline rejection: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(filePath);

    const permanentPublicUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from("employees")
      .update({ profile: permanentPublicUrl })
      .eq("id", employeeIdUUID);

    if (dbError) throw dbError;

    return { success: true, url: permanentPublicUrl };
  } catch (err) {
    throw new Error(`Storage mapping file synchronization dropped: ${(err as Error).message}`);
  }
}