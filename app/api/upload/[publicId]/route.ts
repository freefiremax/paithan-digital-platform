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
    // Require authentication (any authenticated user can delete their own uploads)
    const authResult = await requireAuth();
    const { user } = authResult;

    const { publicId } = await params;

    // Optional: Verify the publicId belongs to the user (if we track ownership)
    // For now, allow any authenticated user to delete (admin-only in future if needed)

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