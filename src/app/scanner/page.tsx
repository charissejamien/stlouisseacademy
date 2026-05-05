"use client";

import { useEffect, useState } from "react";

export default function ScannerPage() {
  const [buffer, setBuffer] = useState("");
  const [lastScan, setLastScan] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If Enter is pressed → finalize scan
      if (e.key === "Enter") {
        if (buffer.trim() !== "") {
          setLastScan(buffer);
          console.log("Scanned ID:", buffer);
          setBuffer("");
        }
        return;
      }

      // Ignore weird keys
      if (e.key.length === 1) {
        setBuffer((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [buffer]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 gap-6">
      
      <h1 className="text-2xl font-bold">
        RFID Scanner Active
      </h1>

      <p className="text-gray-600">
        Tap your card on the reader
      </p>

      {/* LIVE BUFFER */}
      <div className="bg-white p-4 rounded-md shadow w-80 text-center">
        <p className="text-sm text-gray-500">Reading...</p>
        <p className="text-lg font-mono break-all">
          {buffer || "Waiting for scan..."}
        </p>
      </div>

      {/* LAST SCAN RESULT */}
      <div className="bg-green-100 p-6 rounded-md shadow w-80 text-center">
        <p className="text-sm text-green-700">Last Scan</p>
        <p className="text-xl font-bold text-green-900">
          {lastScan || "None yet"}
        </p>
      </div>

    </div>
  );
}