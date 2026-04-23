"use server";

import { createClient } from "@/lib/supabase/server";
import { create } from "domain";

// --- Student Actions ---
export async function saveStudentInfo(state: { success: boolean, message?: string }, formData: FormData) {
    const supabase = await createClient();
    const firstName = formData.get("firstName");

    const { error } = await supabase
        .from('studentInfo')
        .insert({ firstName: firstName });

    if (error) {
        return { success: false, message: error.message };
    }
    
    return { success: true, message: "Student registered!" };
}

export type ActionResponse = {
    success: boolean;
    message: string;
};

// --- Bulletin Actions ---
export async function savePost(state: ActionResponse, formData: FormData): Promise<ActionResponse> {
    const supabase = await createClient();

    const title = formData.get("postTitle");
    const summary = formData.get("postSummary");
    const body = formData.get("postBody");
    const tag = formData.get("postTag");
    const featuredFile = formData.get("featuredImg") as File;
    const galleryFiles = formData.getAll("galleryImgs") as File[];

    let featuredImageUrl = "";
    const galleryUrls: string[] = [];

    try {
        if (featuredFile && featuredFile.size > 0) {
            const fileName = `${Date.now()}-${featuredFile.name}`;
            
            // FIX: Removed 'uploadData' to resolve "unused variable" warning
            const { error: uploadError } = await supabase.storage
                .from('post-images')
                .upload(fileName, featuredFile);

            if (uploadError) throw uploadError;
            
            const { data: publicUrl } = supabase.storage.from('post-images').getPublicUrl(fileName);
            featuredImageUrl = publicUrl.publicUrl;
        }

        for (const file of galleryFiles) {
            if (file.size > 0) {
                const fileName = `gallery/${Date.now()}-${file.name}`;
                const { error: gError } = await supabase.storage.from('post-images').upload(fileName, file);
                if (gError) throw gError;

                const { data: gUrl } = supabase.storage.from('post-images').getPublicUrl(fileName);
                galleryUrls.push(gUrl.publicUrl);
            }
        }

        const { error } = await supabase
            .from('posts')
            .insert([{ 
                title, 
                summary, 
                body, 
                tag,
                featured_image: featuredImageUrl,
                gallery: galleryUrls 
            }]);

        if (error) throw error;

        return { success: true, message: "Post published successfully!" };

    } catch (err: unknown) {
        // FIX: Specified type as 'unknown' and safely extracted the message
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        return { success: false, message: errorMessage };
    }
}
// --- Careers Actions ---
// FIX: Added 'state' parameter and a return for the 'success' case
export async function postJobOpening(state: { success: boolean, message?: string }, formData: FormData) {
    const supabase = await createClient();

    const position = formData.get("jobPosition");
    const specialty = formData.get("jobSpecialty");

    const { error } = await supabase
        .from('careers')
        .insert([
            {
                position: position,
                specialty: specialty
            }
        ]);

    if (error) {
        return {
            success: false,
            message: error.message
        };
    }

    // You were missing a return here!
    return {
        success: true,
        message: "Job opening posted successfully!"
    };
}


export async function getJobOpenings() {
    const supabase = await createClient();
    

    const {data, error} = await supabase
    .from('careers')
    .select("*");

    if (error) {
        console.error("error");
    }

    return data;
}