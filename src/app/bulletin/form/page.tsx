"use client";

import { Textarea } from "@/components/ui/textarea";
import { savePost } from "../../actions";
import { useActionState, useState, useRef } from "react";
import { ImageIcon } from "lucide-react";

export default function Form() {
    const [state, formAction, isPending] = useActionState(savePost, { success: false , message: ""});
    const [tagState, setTagState] = useState("");
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    
    const [preview, setPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    
    const tag = ["Campus Life", "Admissions", "Excellence"];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files).map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...fileArray]);
        }
    };

    return (
        <div className="bg-background">
            <form action={formAction} className="flex w-full mt-10 gap-10">
                <section className="bg-white p-10 w-[65%] h-[80vh] ml-10 rounded-md">
                    <Textarea 
                        name="postTitle" 
                        className="bg-transparent text-[24px] focus:border-none focus-visible:ring-0 placeholder:text-[#cdcdcd] placeholder:text-[24px] placeholder:font-medium resize-none" 
                        placeholder="Enter post title" 
                        required
                    />
                    <Textarea 
                        name="postSummary" 
                        className="bg-transparent focus:border-none focus-visible:ring-0 placeholder:text-[#cdcdcd] placeholder:italic resize-none" 
                        placeholder="Write a short summary for the dashboard feed"
                        required
                    />
                    <Textarea 
                        name="postBody" 
                        className="bg-transparent focus:border-none focus-visible:ring-0 placeholder:text-[#cdcdcd] h-full resize-none" 
                        placeholder="Start typing the body of your update here"
                        required
                    />
                </section>

                <section className="mr-10 flex flex-col gap-5 w-[35%]">
                    <div className="bg-[#F2F5F8] flex flex-col gap-2 p-5 rounded-md">
                        <p className="text-sla-blue font-medium">TAG</p>
                        <input type="hidden" name="postTag" value={tagState} />
                        <div className="flex flex-wrap gap-2">
                            {tag.map((item) => (
                                <button 
                                    key={item}
                                    type="button"
                                    onClick={() => setTagState(item)} 
                                    className={`${item === tagState ? "bg-sla-blue text-white" : "bg-white text-sla-blue"} px-2 py-1 rounded-sm text-[14px] transition-colors`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#F2F5F8] flex flex-col gap-2 p-5 rounded-md cursor-pointer hover:bg-[#ebf0f5] transition-colors"
                    >
                        <p className="text-sla-blue font-medium">FEATURED IMAGE</p>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-md h-40 flex items-center justify-center bg-white overflow-hidden">
                            <input 
                                type="file" 
                                name="featuredImg" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                className="hidden"
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-slate-400">
                                    <ImageIcon size={32} strokeWidth={1.5} />
                                    <span className="text-xs mt-2 font-medium text-center">Click to upload photo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div 
                        onClick={() => galleryInputRef.current?.click()}
                        className="bg-[#F2F5F8] flex flex-col gap-2 p-5 rounded-md cursor-pointer hover:bg-[#ebf0f5] transition-colors"
                    >
                        <p className="text-sla-blue font-medium">GALLERY</p>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-md min-h-40 p-2 flex flex-wrap gap-2 items-center justify-center bg-white overflow-hidden">
                            <input 
                                type="file" 
                                name="galleryImgs" 
                                multiple
                                ref={galleryInputRef} 
                                onChange={handleGalleryChange} 
                                accept="image/*" 
                                className="hidden"
                            />
                            {galleryPreviews.length > 0 ? (
                                galleryPreviews.map((src, index) => (
                                    <img key={index} src={src} alt={`Gallery ${index}`} className="w-16 h-16 object-cover rounded-sm" />
                                ))
                            ) : (
                                <div className="flex flex-col items-center text-slate-400">
                                    <ImageIcon size={32} strokeWidth={1.5} />
                                    <span className="text-xs mt-2 font-medium text-center">Click to add photos</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="bg-sla-blue text-white py-3 rounded-sm font-bold hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
                    >
                        {isPending ? "PUBLISHING..." : "PUBLISH POST"}
                    </button>
                    
                    {state?.success && <p className="text-green-600 font-medium text-center">Post published!</p>}
                </section>
            </form>
        </div>
    );
}