import { NextRequest, NextResponse } from "next/server";
import { getMenuItemById, addMenuItemPhoto } from "@/app/api/data";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/admin/menu/items/:id/photos - Upload multiple photos
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    const formData = await request.formData();
    const files = formData.getAll("photos") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No photos uploaded",
        },
        { status: 400 },
      );
    }

    const uploadedPhotos = [];

    for (const file of files) {
      // Validate file
      if (!file.type.startsWith("image/")) {
        continue; // Skip non-image files
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        continue; // Skip large files
      }

      // In a real app, you'd upload to cloud storage
      // For mock, we'll just create a URL
      const photoData = {
        url: `/images/menu/${file.name}`,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        isPrimary:
          existingItem.photos.length === 0 && uploadedPhotos.length === 0, // First photo is primary
      };

      const newPhoto = addMenuItemPhoto(id, photoData);
      if (newPhoto) {
        uploadedPhotos.push(newPhoto);
      }
    }

    if (uploadedPhotos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid photos were uploaded",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: uploadedPhotos,
      message: `${uploadedPhotos.length} photo(s) uploaded successfully`,
    });
  } catch (error) {
    console.error("Error uploading photos:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload photos",
      },
      { status: 500 },
    );
  }
}
