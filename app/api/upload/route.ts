import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, UploadFolder } from "@/lib/cloudinary";
import { requireAuth } from "@/lib/auth/guard";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";

function dataUrlToBuffer(dataUrl: string): Buffer {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid data URL format");
  }
  const base64 = matches[2];
  return Buffer.from(base64, "base64");
}

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth();
    const { user } = authResult;

    const rateLimit = await checkRateLimit(`upload:${user.id}`, RATE_LIMIT_CONFIGS.apiMutation);
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many uploads. Please wait a moment." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { file, folder } = body;

    if (!file || typeof file !== "string") {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Image file data is required (data URL)" } },
        { status: 400 }
      );
    }

    // Convert data URL to buffer for validation
    let fileBuffer: Buffer;
    try {
      fileBuffer = dataUrlToBuffer(file);
    } catch {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid image data format. Must be a valid data URL." } },
        { status: 400 }
      );
    }

    // Map folder name to allowed upload folders
    const folderMap: Record<string, UploadFolder> = {
      grievances: "grievances",
      profile: "profile",
      documents: "documents",
    };
    const targetFolder = folderMap[folder] || "grievances";

    const uploadResult = await uploadToCloudinary(fileBuffer, targetFolder);

    return NextResponse.json(
      {
        url: uploadResult.secureUrl,
        publicId: uploadResult.publicId,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      },
      { status: 201 }
    );
  } catch (error) {
    return await handleApiError(error);
  }
}