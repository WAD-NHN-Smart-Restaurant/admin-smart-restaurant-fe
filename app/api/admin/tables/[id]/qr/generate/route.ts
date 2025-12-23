import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import { AxiosError } from "axios";

// POST /api/admin/tables/:id/qr/generate - Generate or regenerate QR code
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const response = await axiosServer.post(
      `api/admin/tables/${id}/qr/generate`,
    );
    return NextResponse.json({
      ...response.data,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.response?.data?.message || "Failed to generate QR code",
        },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate QR code",
      },
      { status: 500 },
    );
  }
}
