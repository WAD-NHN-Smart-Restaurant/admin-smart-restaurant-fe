import { NextRequest, NextResponse } from "next/server";
import { mockTables } from "../../../../../data";

// POST /api/admin/tables/:id/qr/generate - Generate or regenerate QR code
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tableIndex = mockTables.findIndex((t) => t.id === id);

    if (tableIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Table not found",
        },
        { status: 404 },
      );
    } // Generate mock QR token (in real app, this would be a signed JWT)
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZUlkIjoiJHtpZH0iLCJyZXN0YXVyYW50SWQiOiIxIiwiaWF0Ijoke0RhdGUubm93KCl9fQ.mock_${Date.now()}`;

    // Generate mock QR code (in real app, this would use qrcode library)
    const mockQRCode =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    // Update table with new QR code data
    mockTables[tableIndex] = {
      ...mockTables[tableIndex],
      qrToken: mockToken,
      qrTokenCreatedAt: new Date().toISOString(),
      qrCodeUrl: mockQRCode,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockTables[tableIndex],
      message: "QR code generated successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate QR code",
      },
      { status: 500 },
    );
  }
}
