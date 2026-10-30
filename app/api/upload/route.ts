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

    const maximumBody = 7 * 1024 * 1024;
    if (Number(req.headers.get('content-length') || 0) > maximumBody) return new NextResponse(null, { status: 413 });
    const reader = req.body?.getReader();
    if (!reader) return new NextResponse(null, { status: 400 });
    let length = 0;
    const chunks: Uint8Array[] = [];
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > maximumBody) { await reader.cancel(); return new NextResponse(null, { status: 413 }); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    let body;
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch { return new NextResponse(null, { status: 400 }); }
    if (!body || typeof body !== 'object') return new NextResponse(null, { status: 400 });
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