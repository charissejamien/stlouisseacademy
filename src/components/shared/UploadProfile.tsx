"use client";

import { useState, useRef } from "react";
import { Camera, UploadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadZoneProps {
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
  uploadAction: (formData: FormData) => Promise<{ success: boolean; url: string }>;
}

export default function ProfileUpload({ currentImageUrl, onUploadComplete, uploadAction }: ImageUploadZoneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return toast.error("File must be a valid image type.");
    if (file.size > 3 * 1024 * 1024) return toast.error("Image must be smaller than 3MB.");

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadAction(formData);
      if (res.success) {
        setPreviewUrl(res.url);
        onUploadComplete(res.url);
        toast.success("Profile image synced successfully!");
      }
    } catch (err) {
      setPreviewUrl(currentImageUrl || null);
      toast.error((err as Error).message || "Failed uploading profile asset image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group w-32 h-32 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden shadow-2xs transition-all hover:border-slate-300">
      {previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Avatar Profile" className="w-full h-full object-cover" />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity gap-1"
          >
            <Camera className="w-4 h-4" />
            <span>Update Photo</span>
          </div>
        </>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center text-center p-4 cursor-pointer w-full h-full gap-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <UploadCloud className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[10px] font-bold tracking-tight uppercase">Upload Photo</span>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-3xs">
          <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}