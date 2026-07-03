"use client";

import React, { useRef, useState, useEffect } from "react";

export default function CertificateBuilder() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // 1. Template Configurations State (Can be saved/loaded from Supabase)
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [nameY, setNameY] = useState(500);
  const [nameSize, setNameSize] = useState(64);
  const [awardY, setAwardY] = useState(620);
  const [awardSize, setAwardSize] = useState(36);

  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  // Sample data just to show how it overlays on your custom upload
  const sampleStudent = { name: "Charisse Santos", status: "With High Honors" };

  // 2. Handle Dynamic Local Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.src = event.target.result as string;
        img.onload = () => {
          setImageElement(img);
          setImageSrc(img.src);
        };
      }
    };
    reader.readAsDataURL(file);
  };

  // 3. Re-render Canvas whenever sliders or image uploads change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Standard high-res target resolution
    canvas.width = 1920;
    canvas.height = 1080;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imageElement) {
      // Draw your uploaded Canva design asset background
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    } else {
      // Gray placeholder frame when no image is uploaded yet
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Please upload a blank certificate template to begin", 1920 / 2, 1080 / 2);
      return;
    }

    // Draw Dynamic Student Name based on Slider Values
    ctx.font = `bold ${nameSize}px Georgia, serif`;
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    ctx.fillText(sampleStudent.name, 1920 / 2, nameY);

    // Draw Dynamic Award Text based on Slider Values
    ctx.font = `italic ${awardSize}px Arial, sans-serif`;
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Awarded for maintaining a status of "${sampleStudent.status}"`, 1920 / 2, awardY);
  }, [imageElement, nameY, nameSize, awardY, awardSize]);

  // 4. Simulate saving layout configuration settings parameters
  const handleSaveLayout = () => {
    const layoutConfig = {
      name_settings: { x: 960, y: nameY, fontSize: nameSize },
      award_settings: { x: 960, y: awardY, fontSize: awardSize }
    };
    
    console.log("Ready to save configuration row to Supabase Database:", layoutConfig);
    alert("Layout configuration saved! Ready to apply to all matching students.");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Dynamic Certificate Template Studio</h1>
        <p className="text-gray-500">Upload any Canva file design and dynamically map where the data overlays match up.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Layout Designer Parameter Tuning Sliders */}
        <div className="space-y-6 bg-gray-50 p-5 rounded-lg border h-fit shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">1. Upload Canva Template (PNG/JPG)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <hr />

          <h3 className="font-bold text-sm text-gray-800">2. Adjust Text Coordinates (Pixels)</h3>

          {/* Student Name Sliders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Student Name Position</h4>
            <div>
              <label className="flex justify-between text-xs text-gray-600">
                <span>Vertical Position (Y)</span>
                <span className="font-mono font-bold">{nameY}px</span>
              </label>
              <input
                type="range" min="100" max="1000" value={nameY}
                onChange={(e) => setNameY(Number(e.target.value))}
                disabled={!imageSrc} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="flex justify-between text-xs text-gray-600">
                <span>Font Size</span>
                <span className="font-mono font-bold">{nameSize}px</span>
              </label>
              <input
                type="range" min="24" max="120" value={nameSize}
                onChange={(e) => setNameSize(Number(e.target.value))}
                disabled={!imageSrc} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Award Text Sliders */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Award Text Position</h4>
            <div>
              <label className="flex justify-between text-xs text-gray-600">
                <span>Vertical Position (Y)</span>
                <span className="font-mono font-bold">{awardY}px</span>
              </label>
              <input
                type="range" min="100" max="1000" value={awardY}
                onChange={(e) => setAwardY(Number(e.target.value))}
                disabled={!imageSrc} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="flex justify-between text-xs text-gray-600">
                <span>Font Size</span>
                <span className="font-mono font-bold">{awardSize}px</span>
              </label>
              <input
                type="range" min="16" max="80" value={awardSize}
                onChange={(e) => setAwardSize(Number(e.target.value))}
                disabled={!imageSrc} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleSaveLayout}
            disabled={!imageSrc}
            className="w-full bg-blue-600 disabled:bg-gray-300 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md text-sm transition-colors shadow-sm pt-4"
          >
            Save Template Layout Parameters
          </button>
        </div>

        {/* Right Side: Interactive Studio View Box Preview Canvas */}
        <div className="lg:col-span-2 flex flex-col items-center border rounded-lg p-4 bg-zinc-800 shadow-inner">
          <div className="w-full flex justify-between text-xs text-zinc-400 mb-2 font-mono">
            <span>LIVE INTERACTIVE PREVIEW MATRICES</span>
            <span>1920 x 1080 Landscape Canvas</span>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full max-w-full h-auto border shadow-lg bg-zinc-900 rounded-sm"
          />
        </div>
      </div>
    </div>
  );
}