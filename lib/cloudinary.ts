import crypto from "crypto";
import { env } from "@/lib/env";

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

export type UploadFolder = "grievances" | "profile" | "documents";

const FOLDER_MAP: Record<UploadFolder, string> = {
  grievances: "paithan/grievances",
  profile: "paithan/profile",
  documents: "paithan/documents",
};

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function detectMimeType(buffer: Buffer): string | null {
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  // GIF: GIF87a or GIF89a
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    (buffer[3] === 0x38 || buffer[3] === 0x39) &&
    buffer[4] === 0x61
  ) {
    return "image/gif";
  }
  return null;
}

function validateFile(buffer: Buffer): { valid: boolean; mimeType?: string; error?: string } {
  if (buffer.length > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024} MB limit` };
  }

  const mimeType = detectMimeType(buffer);
  if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { valid: false, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed." };
  }

  return { valid: true, mimeType };
}

/**
 * Uploads a file (Buffer) to Cloudinary with server-side validation.
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: UploadFolder = "grievances"
): Promise<CloudinaryUploadResult> {
  const validation = validateFile(fileBuffer);
  if (!validation.valid) {
    throw new Error(validation.error || "File validation failed");
  }

  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not properly configured");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const targetFolder = FOLDER_MAP[folder];

  // Generate SHA-1 signature for authenticated upload
  const paramsToSign = `folder=${targetFolder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const formData = new FormData();
  // Convert Buffer to Uint8Array for Blob
  const uint8Array = new Uint8Array(fileBuffer);
  const blob = new Blob([uint8Array], { type: "application/octet-stream" });
  formData.append("file", blob);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("folder", targetFolder);
  formData.append("signature", signature);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        `Cloudinary upload failed (${response.status}): ${errData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    return {
      url: data.url,
      secureUrl: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Cloudinary upload timed out after 30 seconds");
    }
    throw error;
  }
}

/**
 * Deletes an asset from Cloudinary by public ID.
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not properly configured");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        `Cloudinary delete failed (${response.status}): ${errData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.result === "ok" || data.result === "not found";
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Cloudinary delete timed out after 15 seconds");
    }
    throw error;
  }
}