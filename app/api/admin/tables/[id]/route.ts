import { NextRequest, NextResponse } from "next/server";
import { mockTables } from "../../../data";
import { Table } from "@/types/table-type";

// GET /api/admin/tables/:id - Get single table
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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

    return NextResponse.json({
      success: true,
      data: table,
    });
  } catch (_error) {
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
    const tableIndex = mockTables.findIndex((t) => t.id === id);

    if (tableIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Table not found",
        },
        { status: 404 },
      );
    }    // Check if new table number conflicts with another table
    if (
      body.tableNumber &&
      body.tableNumber !== mockTables[tableIndex].tableNumber
    ) {
      const existingTable = mockTables.find(
        (t) => t.tableNumber === body.tableNumber && t.id !== id,
      );
      if (existingTable) {
        return NextResponse.json(
          {
            success: false,
            message: "Table number already exists",
          },
          { status: 409 },
        );
      }
    }    // Update table
    const updatedTable = {
      ...mockTables[tableIndex],
      ...body,
      id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    } as any;

    mockTables[tableIndex] = updatedTable;

    return NextResponse.json({
      success: true,
      data: updatedTable,
      message: "Table updated successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update table",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/tables/:id - Delete table
export async function DELETE(
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
    }

    // Remove table from array
    mockTables.splice(tableIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete table",
      },
      { status: 500 },
    );
  }
}
