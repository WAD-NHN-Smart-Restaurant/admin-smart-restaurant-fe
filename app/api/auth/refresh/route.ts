import { NextRequest, NextResponse } from "next/server";

// Mock token generation
function generateMockToken(userId: string, type: "access" | "refresh"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `mock_${type}_token_${userId}_${timestamp}_${random}`;
}

// Extract user ID from mock token
function extractUserIdFromToken(token: string): string | null {
  try {
    // Mock token format: mock_refresh_token_userId_timestamp_random
    const parts = token.split("_");
    if (parts.length >= 4 && parts[0] === "mock" && parts[1] === "refresh") {
      return parts[3];
    }
    return null;
  } catch {
    return null;
  }
}

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

    // Validate refresh token and extract user ID
    const userId = extractUserIdFromToken(refreshToken);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid refresh token",
        },
        { status: 401 },
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Generate new tokens
    const newAccessToken = generateMockToken(userId, "access");
    const newRefreshToken = generateMockToken(userId, "refresh");

    // Create response with new cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: 20 * 60, // 20 minutes in seconds
        },
      },
      { status: 200 },
    );

    // Set new HTTP-only cookies for tokens
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 20 * 60, // 20 minutes
      path: "/",
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

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
