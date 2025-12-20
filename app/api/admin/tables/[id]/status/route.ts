import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import { toFrontendTableFormat } from "@/libs/api-transform";
import { AxiosError } from "axios";

// PATCH /api/admin/tables/:id/status - Update table status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !["available", "inactive", "occupied"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid status. Must be 'available', 'inactive', or 'occupied'",
        },
        { status: 400 },
      );
    }

    const response = await axiosServer.patch(`api/admin/tables/${id}/status`, {
      status,
    });

    // Transform backend response to frontend format
    const frontendResult = {
      ...response.data,
      data: toFrontendTableFormat(response.data.data),
    };

    return NextResponse.json(frontendResult);
  } catch (error) {
    console.error("Table status PATCH error:", error);

    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.response?.data?.message || "Failed to update table status",
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update table status",
      },
      { status: 500 },
    );
  }
}
