import { NextRequest, NextResponse } from "next/server";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/app/api/data";
import { updateCategorySchema } from "@/schema/category-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/menu/categories/:id - Get single category
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const category = getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    console.error(
      `GET /api/admin/menu/categories/${(await params).id} error:`,
      error,
    );
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PUT /api/admin/menu/categories/:id - Update category details
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Validate request body
    const validatedData = updateCategorySchema.parse({ ...body, id });

    // Check if category name already exists (excluding current category)
    const categories = await import("@/app/api/data").then((m) => m.categories);
    const nameConflict = categories.find(
      (cat) =>
        cat.id !== id &&
        cat.name.toLowerCase() === validatedData.name.toLowerCase(),
    );

    if (nameConflict) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name already exists",
        },
        { status: 409 },
      );
    }

    // Check if display order already exists (excluding current category)
    const orderConflict = categories.find(
      (cat) => cat.id !== id && cat.displayOrder === validatedData.displayOrder,
    );

    if (orderConflict) {
      return NextResponse.json(
        {
          success: false,
          message: "Display order already exists",
        },
        { status: 409 },
      );
    }

    // Update category
    const updatedCategory = updateCategory(id, {
      name: validatedData.name,
      description: validatedData.description,
      displayOrder: validatedData.displayOrder,
      status: validatedData.status,
    });

    if (!updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update category",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(
      `PUT /api/admin/menu/categories/${(await params).id} error:`,
      error,
    );

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/menu/categories/:id - Soft delete category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    // Check if category has active items (simulate check)
    if (existingCategory.itemCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete category with active menu items",
        },
        { status: 400 },
      );
    }

    // Delete category
    const deleted = deleteCategory(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete category",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(
      `DELETE /api/admin/menu/categories/${(await params).id} error:`,
      error,
    );
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
