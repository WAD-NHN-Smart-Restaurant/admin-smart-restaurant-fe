import { NextRequest, NextResponse } from "next/server";
import { getMenuItemById, deleteMenuItemPhoto } from "@/app/api/data";

interface RouteParams {
  params: Promise<{
    id: string;
    photoId: string;
  }>;
}

// DELETE /api/admin/menu/items/:id/photos/:photoId - Remove photo
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const success = deleteMenuItemPhoto(id, photoId);

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
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete photo",
      },
      { status: 500 },
    );
  }
}
