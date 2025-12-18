import { NextRequest, NextResponse } from "next/server";
import { mockTables } from "../../../../data";

// PATCH /api/admin/tables/:id/status - Update table status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !["active", "inactive", "occupied"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid status. Must be 'active', 'inactive', or 'occupied'",
        },
        { status: 400 },
      );
    }

    const tableIndex = mockTables.findIndex((t) => t.id === params.id);

    if (tableIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Table not found",
        },
        { status: 404 },
      );
    }

    // Update status

    return NextResponse.json({
      success: true,
      data: mockTables[tableIndex],
      message: `Table ${status === "active" ? "activated" : "deactivated"} successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update table status",
      },
      { status: 500 },
    );
  }
}
