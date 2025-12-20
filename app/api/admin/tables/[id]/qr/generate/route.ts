import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import { AxiosError } from "axios";
import { toFrontendTableFormat } from "@/libs/api-transform";

// POST /api/admin/tables/:id/qr/generate - Generate or regenerate QR code
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const response = await axiosServer.post(`api/admin/tables/${id}/qr/generate`);
    return NextResponse.json({
      ...response.data,
      data: toFrontendTableFormat(response.data.data?.table || response.data.data),
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "Failed to generate QR code",
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
