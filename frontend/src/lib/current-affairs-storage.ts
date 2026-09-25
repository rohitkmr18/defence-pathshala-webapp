import { createClient } from "@/lib/supabase/client";

export type UploadedSlide = {
  slideNumber: number;
  imageUrl: string;
};

export async function uploadSlides(
  files: File[],
  date: string,
): Promise<UploadedSlide[]> {
  const supabase = createClient();
  const uploaded: UploadedSlide[] = [];

  for (const [index, file] of files.entries()) {
    const slideNumber = index + 1;
    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${date}/slide-${slideNumber}.${extension}`;

    const { error } = await supabase.storage
      .from("current-affairs")
      .upload(path, file, {
        upsert: true,
        contentType: file.type || undefined,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("current-affairs")
      .getPublicUrl(path);

    uploaded.push({ slideNumber, imageUrl: data.publicUrl });
  }

  return uploaded;
}