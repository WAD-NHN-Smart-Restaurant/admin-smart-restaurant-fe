import { NextRequest, NextResponse } from "next/server";
import {
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "@/app/api/data";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/admin/menu/items/:id - Get item details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const item = getMenuItemById(id);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
      message: "Menu item retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch menu item",
      },
      { status: 500 },
    );
  }
}

// PUT /api/admin/menu/items/:id - Update item details
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

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

    const updatedItem = updateMenuItem(id, {
      ...body,
      price: body.price ? Number(body.price) : existingItem.price,
      prepTime: body.prepTime ? Number(body.prepTime) : existingItem.prepTime,
      isChefRecommendation: Boolean(body.isChefRecommendation),
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: "Menu item updated successfully",
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update menu item",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/menu/items/:id - Soft delete item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const success = deleteMenuItem(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete menu item",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete menu item",
      },
      { status: 500 },
    );
  }
}
