import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_SECRET) {
  // Allow local dev without Cloudinary, but warn
  console.warn(
    "Cloudinary envs missing: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET"
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
  secure: true,
});

export async function uploadBase64Image(
  dataUrl: string,
  folder = "event-match"
) {
  // Accept data URLs only
  if (!dataUrl.startsWith("data:")) return null;
  const res = await cloudinary.uploader.upload(dataUrl, {
    folder,
    overwrite: true,
    resource_type: "image",
    transformation: [{ width: 512, height: 512, crop: "limit" }],
  });
  return res.secure_url;
}
