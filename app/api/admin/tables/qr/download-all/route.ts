import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import { AxiosError } from "axios";

// GET /api/admin/tables/qr/download-all - Download all QR codes as ZIP or PDF
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "png";

    const backendResponse = await axiosServer.get(
      `api/admin/tables/qr/download-all`,
      {
        params: { format },
        responseType: "arraybuffer",
      },
    );

    const contentType =
      backendResponse.headers["content-type"] ||
      (format === "pdf" ? "application/pdf" : "application/zip");
    const contentDisposition =
      backendResponse.headers["content-disposition"] ||
      `attachment; filename=all-tables-qr.${format === "png" ? "zip" : "pdf"}`;

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
          message:
            error.response?.data?.message || "Failed to download QR codes",
        },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to download QR codes",
      },
      { status: 500 },
    );
  }
}
