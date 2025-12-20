import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axiosServer from "@/libs/axios-server";
import {
  toBackendTableFormat,
  toFrontendTablesFormat,
  toFrontendTableFormat,
} from "@/libs/api-transform";
import { AxiosError } from "axios";

// GET /api/admin/tables - Get all tables with optional filters
export async function GET(request: NextRequest) {
  try {
    // Build query parameters for backend
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string> = {};

    if (searchParams.get("status")) params.status = searchParams.get("status")!;
    if (searchParams.get("location"))
      params.location = searchParams.get("location")!;
    if (searchParams.get("sortBy")) params.sortBy = searchParams.get("sortBy")!;
    if (searchParams.get("sortOrder"))
      params.sortOrder = searchParams.get("sortOrder")!;
    const response = await axiosServer.get("/api/admin/tables", {
      params,
    });

    // Transform backend data to frontend format
    const frontendData = {
      ...response.data,
      data: toFrontendTablesFormat(response.data.data),
    };

    return NextResponse.json(frontendData);
  } catch (error) {
    console.error("Tables GET error:", error);

    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "Failed to fetch tables",
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tables",
      },
      { status: 500 },
    );
  }
}

// POST /api/admin/tables - Create new table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Transform frontend format to backend format
    const backendData = toBackendTableFormat(body);

    const response = await axiosServer.post("/api/admin/tables", backendData);

    // Transform backend response to frontend format
    const frontendResult = {
      ...response.data,
      data: toFrontendTableFormat(response.data.data),
    };

    return NextResponse.json(frontendResult, { status: 201 });
  } catch (error) {
    console.error("Tables POST error:", error);

    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "Failed to create table",
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create table",
      },
      { status: 500 },
    );
  }
}
