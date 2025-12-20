import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import { AxiosError } from "axios";

// GET /api/admin/tables/:id/qr/download - Download QR code as PNG or PDF
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "png";
    const includeLogo = searchParams.get("includeLogo") === "true";
    const includeWifi = searchParams.get("includeWifi") === "true";

    const backendResponse = await axiosServer.get(`api/admin/tables/${id}/qr/download`, {
      params: { format, includeLogo, includeWifi },
      responseType: "arraybuffer",
    });

    const contentType = backendResponse.headers["content-type"] || (format === "pdf" ? "application/pdf" : "image/png");
    const contentDisposition = backendResponse.headers["content-disposition"] || `attachment; filename=table-${id}-qr.${format}`;

    return new NextResponse(backendResponse.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "Failed to download QR code",
        },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to download QR code",
      },
      { status: 500 },
    );
  }
}
