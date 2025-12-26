import { NextRequest, NextResponse } from "next/server";
import { getMenuItems, createMenuItem, getCategories } from "@/app/api/data";
import { MenuItem, MenuItemStatus } from "@/types/menu-item-type";
import { Category } from "@/types/category-type";

// GET /api/admin/menu/items - List items with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const status = searchParams.get("status") as MenuItemStatus | null;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    let items = getMenuItems();

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.categoryName.toLowerCase().includes(searchLower),
      );
    }

    if (categoryId) {
      items = items.filter((item) => item.categoryId === categoryId);
    }

    if (status) {
      items = items.filter((item) => item.status === status);
    }

    // Apply sorting
    items.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof MenuItem] as
        | string
        | number;
      let bValue: string | number = b[sortBy as keyof MenuItem] as
        | string
        | number;

      // Handle different data types
      if (sortBy === "price" || sortBy === "popularity") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === "createdAt") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    const totalPages = Math.ceil(items.length / limit);

    return NextResponse.json({
      data: {
        items: paginatedItems,
        pagination: {
          page,
          limit,
          total: items.length,
          totalPages,
        },
      },
      code: "SUCCESS",
      message: "Menu items retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      {
        data: null,
        code: "ERROR",
        message: "Failed to fetch menu items",
      },
      { status: 500 },
    );
  }
}

// POST /api/admin/menu/items - Create new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      categoryId,
      price,
      description,
      prepTime,
      status,
      isChefRecommendation,
    } = body;

    // Validate required fields
    if (!name || !categoryId || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, category, and price are required",
        },
        { status: 400 },
      );
    }

    // Validate category exists
    const categories = getCategories();
    const categoryExists = categories.some(
      (cat: Category) => cat.id === categoryId,
    );
    if (!categoryExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 400 },
      );
    }

    const newItem = createMenuItem({
      name,
      categoryId,
      price: Number(price),
      description,
      prepTime: prepTime ? Number(prepTime) : undefined,
      status: status || MenuItemStatus.ACTIVE,
      isChefRecommendation: Boolean(isChefRecommendation),
    });

    return NextResponse.json({
      success: true,
      data: newItem,
      message: "Menu item created successfully",
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create menu item",
      },
      { status: 500 },
    );
  }
}
