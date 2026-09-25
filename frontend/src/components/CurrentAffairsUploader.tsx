
"use client";

import { useState } from "react";
import { uploadSlides } from "@/lib/current-affairs-storage";

type UploadedSlide = {
  slideNumber: number;
  imageUrl: string;
};

export default function CurrentAffairsUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedSlides, setUploadedSlides] = useState<UploadedSlide[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;

    const filesArray = Array.from(selected).reverse();
    setFiles(filesArray);
    setUploadedSlides([]);
    setUploadMessage(null);
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading) return;

    setUploading(true);
    setUploadMessage(null);

    try {
      const date = new Date().toISOString().split("T")[0];
      const uploaded = await uploadSlides(files, date);

      const response = await fetch("/api/current-affairs/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          title: `Daily Current Affairs — ${date}`,
          summary: `${uploaded.length} slides uploaded.`,
          slides: uploaded,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish.");
      }

      setUploadMessage(`${uploaded.length} slides uploaded successfully.`);
    } catch (error) {
      console.error(error);
      setUploadMessage("Upload failed. Check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">

      <label
        htmlFor="slides"
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 hover:bg-slate-100"
      >
        <div className="text-center">
          <div className="text-4xl">📤</div>
          <p className="mt-3 text-lg font-semibold">
            Drag today&apos;s slides here
          </p>
          <p className="text-sm text-slate-500">
            PNG or JPG • Auto-numbered
          </p>
        </div>

        <input
          id="slides"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Preview</h3>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {files.length} slides
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file, index) => (
              <div
                key={file.name}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Slide ${index + 1}`}
                  className="aspect-[3/4] w-full object-cover"
                />

                <div className="border-t p-3">
                  <p className="font-medium">Slide {index + 1}</p>
                  <p className="truncate text-xs text-slate-500">
                    {file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {uploading ? "Uploading..." : "Upload Slides"}
          </button>

          {uploadMessage && (
            <p className="text-sm text-slate-600">{uploadMessage}</p>
          )}
        </>
      )}
    </div>
  );
}