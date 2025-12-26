import { NextRequest, NextResponse } from "next/server";
import { getMenuItemById, setPrimaryPhoto } from "@/app/api/data";

interface RouteParams {
  params: Promise<{
    id: string;
    photoId: string;
  }>;
}

// PATCH /api/admin/menu/items/:id/photos/:photoId/primary - Set primary photo
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, photoId } = await params;

    const existingItem = getMenuItemById(id);
    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
        },
        { status: 404 },
      );
    }

    const success = setPrimaryPhoto(id, photoId);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Photo not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Primary photo set successfully",
    });
  } catch (error) {
    console.error("Error setting primary photo:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to set primary photo",
      },
      { status: 500 },
    );
  }
}
