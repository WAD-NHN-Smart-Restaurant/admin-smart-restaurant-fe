import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import { AxiosError } from "axios";

/**
 * GET /api/admin/tables/locations
 * Fetches unique locations from the backend
 */
export async function GET(request: NextRequest) {
  try {
    const response = await axiosServer.get("api/admin/tables/locations");

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching locations:", error);

    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "Failed to fetch locations",
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to fetch locations" },
      { status: 500 },
    );
  }
}
