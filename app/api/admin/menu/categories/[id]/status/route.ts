import { NextRequest, NextResponse } from "next/server";
import { getCategoryById, updateCategory } from "@/app/api/data";
import { CategoryStatus } from "@/types/category-type";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/menu/categories/:id/status - Activate/deactivate category
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if category exists
    const existingCategory = getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    // Validate status
    const { status } = body;
    if (!Object.values(CategoryStatus).includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status. Must be ACTIVE or INACTIVE",
        },
        { status: 400 },
      );
    }

    // Update status
    const updatedCategory = updateCategory(id, { status });

    if (!updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update category status",
        },
        { status: 500 },
      );
    }

    const statusText =
      status === CategoryStatus.ACTIVE ? "activated" : "deactivated";

    return NextResponse.json({
      success: true,
      message: `Category ${statusText} successfully`,
      data: updatedCategory,
    });
  } catch (error) {
    console.error(
      `PATCH /api/admin/menu/categories/${(await params).id}/status error:`,
      error,
    );
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
