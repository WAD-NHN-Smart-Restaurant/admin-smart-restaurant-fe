import { NextRequest, NextResponse } from "next/server";
import { categories, addCategory } from "@/app/api/data";
import { CategoryStatus, Category } from "@/types/category-type";
import {
  categoryFilterSchema,
  createCategorySchema,
} from "@/schema/category-schema";

interface CategoryFilterParams {
  search?: string;
  status?: CategoryStatus;
  sortBy?: "name" | "displayOrder" | "itemCount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// GET /api/admin/menu/categories - List categories with filtering/sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate filter parameters
    const filterParams: Partial<CategoryFilterParams> = {
      search: searchParams.get("search") || undefined,
      status: (searchParams.get("status") as CategoryStatus) || undefined,
      sortBy:
        (searchParams.get("sortBy") as
          | "name"
          | "displayOrder"
          | "itemCount"
          | "createdAt") || "displayOrder",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    // Validate filters
    const validatedFilters = categoryFilterSchema.parse(filterParams);

    // Apply filters
    let filteredCategories = [...categories];

    // Search filter
    if (validatedFilters.search) {
      const searchTerm = validatedFilters.search.toLowerCase();
      filteredCategories = filteredCategories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm) ||
          cat.description?.toLowerCase().includes(searchTerm),
      );
    }

    // Status filter
    if (validatedFilters.status) {
      filteredCategories = filteredCategories.filter(
        (cat) => cat.status === validatedFilters.status,
      );
    }

    const sortBy = validatedFilters.sortBy || "displayOrder";
    const sortOrder = validatedFilters.sortOrder || "asc";

    filteredCategories.sort((a, b) => {
      const aVal = a[sortBy as keyof Category];
      const bVal = b[sortBy as keyof Category];

      // Handle string comparisons
      if (typeof aVal === "string" && typeof bVal === "string") {
        const aValLower = aVal.toLowerCase();
        const bValLower = bVal.toLowerCase();
        if (aValLower < bValLower) return sortOrder === "asc" ? -1 : 1;
        if (aValLower > bValLower) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortOrder === "asc" ? 1 : -1;
      if (bVal == null) return sortOrder === "asc" ? -1 : 1;

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Response
    return NextResponse.json({
      success: true,
      message: "Categories retrieved successfully",
      data: filteredCategories,
    });
  } catch (error) {
    console.error("GET /api/admin/menu/categories error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve categories",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// POST /api/admin/menu/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createCategorySchema.parse(body);

    // Check if category name already exists
    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === validatedData.name.toLowerCase(),
    );

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name already exists",
        },
        { status: 409 },
      );
    }

    // Check if display order already exists
    const existingOrder = categories.find(
      (cat) => cat.displayOrder === validatedData.displayOrder,
    );
    if (existingOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Display order already exists",
        },
        { status: 409 },
      );
    }

    // Create new category
    const newCategory = addCategory({
      name: validatedData.name,
      description: validatedData.description,
      displayOrder: validatedData.displayOrder,
      status: validatedData.status,
      itemCount: 0, // New categories start with 0 items
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: newCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/menu/categories error:", error);

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
        message: "Failed to create category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
