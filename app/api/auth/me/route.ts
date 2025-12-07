import { NextRequest, NextResponse } from "next/server";

// Mock users (you can extend this with the same data as login)
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "admin",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "user",
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
  },
];

// Extract user ID from mock token
function extractUserIdFromToken(token: string): string | null {
  try {
    // Mock token format: mock_access_token_userId_timestamp_random
    const parts = token.split("_");
    if (parts.length >= 4 && parts[0] === "mock" && parts[1] === "access") {
      return parts[3];
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - No token provided",
        },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Validate token and extract user ID
    const userId = extractUserIdFromToken(token);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Invalid token",
        },
        { status: 401 },
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find user
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User retrieved successfully",
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
