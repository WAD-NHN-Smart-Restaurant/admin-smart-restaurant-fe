import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "../../data";

// Mock token generation
function generateMockToken(userId: string, type: "access" | "refresh"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `mock_${type}_token_${userId}_${timestamp}_${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    // Generate tokens
    const accessToken = generateMockToken(user.id, "access");
    const refreshToken = generateMockToken(user.id, "refresh");

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Create response with cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: 20 * 60, // 20 minutes in seconds
          },
        },
      },
      { status: 200 },
    );

    // Set HTTP-only cookies for tokens
    response.cookies.set("accessToken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 20 * 60, // 20 minutes
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
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
