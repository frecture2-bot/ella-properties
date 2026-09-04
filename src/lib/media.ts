/** Public URL for a file stored in the images bucket (bucket is private, served via a public route). */
export function mediaUrl(storagePath: string) {
  return `/api/public/media/${storagePath.split("/").map(encodeURIComponent).join("/")}`;
}

/** Safe file extension derived from the file name or its MIME type. */
export function fileExt(file: File) {
  const fromName = file.name.includes(".") ? file.name.split(".").pop()! : "";
  const clean = fromName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  if (clean) return clean;
  const fromType = file.type.split("/")[1]?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return fromType || "bin";
}

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export function isImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif|bmp|tiff?|svg|heic|heif|jfif|ico)$/i.test(file.name);
}
