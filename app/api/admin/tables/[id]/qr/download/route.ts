import { NextRequest, NextResponse } from "next/server";
import { mockTables } from "../../../../../data";

// GET /api/admin/tables/:id/qr/download - Download QR code as PNG or PDF
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "png";

    const table = mockTables.find((t) => t.id === id);

    if (!table) {
      return NextResponse.json(
        {
          success: false,
          message: "Table not found",
        },
        { status: 404 },
      );
    }

    if (!table.qrCodeUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "QR code not generated for this table",
        },
        { status: 404 },
      );
    }

    // In a real app, this would generate and return the actual file
    // For mock purposes, return a simple response
    const mockFileContent = `Mock ${format.toUpperCase()} file for table ${table.tableNumber}`;
    const blob = new Blob([mockFileContent], {
      type: format === "pdf" ? "application/pdf" : "image/png",
    });

    const headers = new Headers();
    headers.set(
      "Content-Type",
      format === "pdf" ? "application/pdf" : "image/png",
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="table-${table.tableNumber}-qr.${format}"`,
    );

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to download QR code",
      },
      { status: 500 },
    );
  }
}
