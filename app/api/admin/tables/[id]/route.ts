import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import {
  toBackendTableFormat,
  toFrontendTableFormat,
  toFrontendTableWithOrderStatus,
} from "@/libs/api-transform";
import { AxiosError } from "axios";

// GET /api/admin/tables/:id - Get single table
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const response = await axiosServer.get(`api/admin/tables/${id}`);

    // Transform backend response to frontend format
    const frontendData = {
      ...response.data,
      data: toFrontendTableWithOrderStatus(response.data.data),
    };

    return NextResponse.json(frontendData);
  } catch (error) {
    console.error("Table GET error:", error);

    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "Table not found",
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch table",
      },
      { status: 500 },
    );
  }
}

// PUT /api/admin/tables/:id - Update table
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Transform frontend format to backend format
    const backendData = toBackendTableFormat(body);

    const response = await axiosServer.put(
      `api/admin/tables/${id}`,
      backendData,
    );

    // Transform backend response to frontend format
    const frontendResult = {
      ...response.data,
      data: toFrontendTableFormat(response.data.data),
    };

    return NextResponse.json(frontendResult);
  } catch (error) {
    console.error("Table PUT error:", error);

    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "Failed to update table",
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update table",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/tables/:id - Delete table (soft delete via status)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Instead of hard delete, we soft delete by setting status to inactive
    await axiosServer.patch(`api/admin/tables/${id}/status`, {
      status: "inactive",
    });

    return NextResponse.json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    console.error("Table DELETE error:", error);

    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "Failed to delete table",
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete table",
      },
      { status: 500 },
    );
  }
}
