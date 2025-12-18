import { NextRequest, NextResponse } from "next/server";

// Mock token blacklist (in a real app, this would be stored in a database)
const blacklistedTokens: Set<string> = new Set();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is required",
        },
        { status: 400 },
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Add token to blacklist
    blacklistedTokens.add(refreshToken);

    // Create response and clear cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 },
    );

    // Clear authentication cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
