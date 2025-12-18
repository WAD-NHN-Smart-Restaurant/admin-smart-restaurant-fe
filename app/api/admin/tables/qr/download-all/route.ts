import { NextRequest, NextResponse } from "next/server";
import { mockTables } from "../../../../data";

// GET /api/admin/tables/qr/download-all - Download all QR codes as ZIP or PDF
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "png";

    // Filter tables that have QR codes
    const tablesWithQR = mockTables.filter((t) => t.qrCodeUrl);

    if (tablesWithQR.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No tables with QR codes found",
        },
        { status: 404 },
      );
    }

    // In a real app, this would:
    // - For PNG: Create a ZIP file with all QR code images
    // - For PDF: Create a single PDF with all QR codes
    // For mock purposes, return a simple response
    const mockFileContent = `Mock ${format === "png" ? "ZIP" : "PDF"} file containing ${tablesWithQR.length} QR codes`;
    const blob = new Blob([mockFileContent], {
      type: format === "png" ? "application/zip" : "application/pdf",
    });

    const headers = new Headers();
    headers.set(
      "Content-Type",
      format === "png" ? "application/zip" : "application/pdf",
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="all-tables-qr.${format === "png" ? "zip" : "pdf"}"`,
    );

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to download QR codes",
      },
      { status: 500 },
    );
  }
}
