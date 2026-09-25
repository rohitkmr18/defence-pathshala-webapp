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

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;

    // Reverse because Windows selection currently gives your carousel in reverse order.
    const filesArray = Array.from(selected).reverse();

    setFiles(filesArray);
    setUploadedSlides([]);
  };

  const handlePublish = async () => {
    if (files.length === 0) {
      alert("Please select slides first.");
      return;
    }

    try {
      setUploading(true);

      const today = new Date().toISOString().split("T")[0];

      // 1. Upload images to Supabase Storage
      const uploaded = await uploadSlides(files, today);

      // 2. Publish metadata
      const response = await fetch("/api/current-affairs/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: today,
          title: `Daily Current Affairs — ${today}`,
          summary: `${uploaded.length} slides uploaded.`,
          slides: uploaded,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Publishing failed.");
      }

      setUploadedSlides(uploaded);

      alert("Today's Current Affairs published successfully.");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Publishing failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Upload Box */}
      <label
        htmlFor="ca-slides"
        className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 transition hover:bg-slate-100"
      >
        <div className="text-center">
          <div className="text-5xl">📤</div>

          <h3 className="mt-4 text-2xl font-bold text-slate-900">
            Upload Today's Carousel
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Drag & drop or click to select 7–9 PNG/JPG slides.
          </p>
        </div>

        <input
          id="ca-slides"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* Selected Counter */}
      {files.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <h4 className="font-semibold text-slate-900">
              {files.length} Slides Selected
            </h4>

            <p className="text-sm text-slate-500">
              Ready to publish today's current affairs.
            </p>
          </div>

          <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            {files.length} Slides
          </div>
        </div>
      )}

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Preview
            </h3>

            <span className="text-sm text-slate-500">
              Verify the slide order before publishing.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">

            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Slide ${index + 1}`}
                  className="aspect-[3/4] w-full object-cover"
                />

                <div className="border-t border-slate-100 p-3">

                  <p className="font-semibold text-slate-900">
                    Slide {index + 1}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {file.name}
                  </p>

                </div>
              </div>
            ))}

          </div>

        </div>
      )}

      {/* Publish Button */}
      {files.length > 0 && (
        <button
          onClick={handlePublish}
          disabled={uploading}
          className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {uploading ? "Publishing..." : "Publish Today's Current Affairs"}
        </button>
      )}

      {/* Success Card */}
      {uploadedSlides.length > 0 && (
        <div className="rounded-3xl border border-green-200 bg-green-50 p-6">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-xl font-bold text-green-800">
                Published Successfully
              </h3>

              <p className="mt-1 text-sm text-green-700">
                {uploadedSlides.length} slides are now stored in Supabase and linked to today's brief.
              </p>

            </div>

            <div className="text-4xl">✅</div>

          </div>

          <div className="mt-5 rounded-2xl bg-white p-4">

            <div className="flex justify-between py-2 text-sm">
              <span className="text-slate-500">Storage Bucket</span>
              <span className="font-semibold">current-affairs</span>
            </div>

            <div className="flex justify-between py-2 text-sm">
              <span className="text-slate-500">Folder</span>
              <span className="font-semibold">
                {new Date().toISOString().split("T")[0]}
              </span>
            </div>

            <div className="flex justify-between py-2 text-sm">
              <span className="text-slate-500">Status</span>
              <span className="font-semibold text-green-700">
                Live on Defence Pathshala
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}