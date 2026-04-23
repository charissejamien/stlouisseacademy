"use server";

import { createClient } from "@/lib/supabase/client";

export async function saveStudentInfo(state: { success: boolean }, formData: FormData) {

    const supabase = await createClient();

    const firstName = formData.get("firstName");

    const {error} = await supabase
        .from('studentInfo')
        .insert({firstName : firstName})
    
    return{success : true};
}

//Bulletin Actions

export async function savePost(state: { success: boolean, message?: string }, formData: FormData) {
    const supabase = await createClient();

    // 1. Collect all form data
    const title = formData.get("postTitle");
    const summary = formData.get("postSummary");
    const body = formData.get("postBody");
    const tag = formData.get("postTag"); // From our hidden input
    const featuredFile = formData.get("featuredImg") as File;
    const galleryFiles = formData.getAll("galleryImgs") as File[];
    console.log("File Name:", featuredFile?.name);
    console.log("File Size:", featuredFile?.size);

    let featuredImageUrl = "";
    const galleryUrls: string[] = [];

    try {
        // 2. Upload Featured Image if it exists
        if (featuredFile && featuredFile.size > 0) {
            const fileName = `${Date.now()}-${featuredFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('post-images') // Make sure this bucket exists in Supabase!
                .upload(fileName, featuredFile);

            if (uploadError) throw uploadError;
            
            const { data: publicUrl } = supabase.storage.from('post-images').getPublicUrl(fileName);
            featuredImageUrl = publicUrl.publicUrl;
        }

        // 3. Upload Gallery Images
        for (const file of galleryFiles) {
            if (file.size > 0) {
                const fileName = `gallery/${Date.now()}-${file.name}`;
                const { error: gError } = await supabase.storage.from('post-images').upload(fileName, file);
                if (gError) throw gError;

                const { data: gUrl } = supabase.storage.from('post-images').getPublicUrl(fileName);
                galleryUrls.push(gUrl.publicUrl);
            }
        }

        // 4. Save everything to the 'posts' table
        const { error } = await supabase
            .from('posts')
            .insert([{ 
                title, 
                summary, 
                body, 
                tag,
                featured_image: featuredImageUrl,
                gallery: galleryUrls // This should be a JSONB or Text[] column in Supabase
            }]);

        if (error) throw error;

        return { success: true, message: "Post published successfully!" };

    } catch (err: any) {
        return { success: false, message: err.message || "An unexpected error occurred" };
    }
}