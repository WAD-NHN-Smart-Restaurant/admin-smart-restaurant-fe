import { NextRequest, NextResponse } from "next/server";
import { mockTables } from "../../data";
import { Table } from "@/types/table-type";

// GET /api/admin/tables - Get all tables with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const location = searchParams.get("location");
    const search = searchParams.get("search");

    let filteredTables = [...mockTables];

    // Filter by status
    if (status) {
      filteredTables = filteredTables.filter(
        (table) => table.status === status,
      );
    }

    // Filter by location
    if (location) {
      filteredTables = filteredTables.filter(
        (table) => table.location === location,
      );
    }

    // Search by table number or location
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTables = filteredTables.filter(
        (table) =>
          table.tableNumber.toLowerCase().includes(searchLower) ||
          table.location.toLowerCase().includes(searchLower),
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredTables,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tables",
      },
      { status: 500 },
    );
  }
}

// POST /api/admin/tables - Create new table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableNumber, capacity, location, description, status } = body;

    // Validate required fields
    if (!tableNumber || !capacity || !location) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Check if table number already exists
    const existingTable = mockTables.find((t) => t.tableNumber === tableNumber);
    if (existingTable) {
      return NextResponse.json(
        {
          success: false,
          message: "Table number already exists",
        },
        { status: 409 },
      );
    }

    // Create new table
    const newTable = {
      id: String(mockTables.length + 1),
      tableNumber,
      capacity: Number(capacity),
      location,
      description: description ? String(description) : "",
      status: status || "available",
      qrToken: "",
      qrTokenCreatedAt: new Date().toISOString(),
      qrCodeUrl: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTables.push(newTable);

    return NextResponse.json(
      {
        success: true,
        data: newTable,
        message: "Table created successfully",
      },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create table",
      },
      { status: 500 },
    );
  }
}
