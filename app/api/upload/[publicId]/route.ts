import { NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { requireAuth } from "@/lib/auth/guard";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    // Asset ownership is not yet recorded. Until it is, only council admins
    // may delete portal-owned assets; signing in alone is not ownership.
    const { user } = await requireAuth("ADMIN");
    const { publicId } = await params;
    if (!/^paithan\/(grievances|profile|documents)\/[a-zA-Z0-9_/-]+$/.test(publicId) || publicId.includes('..')) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid portal asset identifier' } }, { status: 400 });
    }

    const rateLimit = await checkRateLimit(`delete-upload:${user.id}`, RATE_LIMIT_CONFIGS.apiMutation);
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many delete requests. Please wait." } },
        { status: 429 }
      );
    }

    const deleted = await deleteFromCloudinary(publicId);

    if (!deleted) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Asset not found or already deleted" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, publicId });
  } catch (error) {
    return await handleApiError(error);
  }
}