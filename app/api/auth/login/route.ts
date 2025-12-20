import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import { cookies } from "next/headers";

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

    // Forward request to backend
    const response = await axiosServer.post("api/auth/login", {
      email,
      password,
    });

    const data = response.data;

    // Store tokens in HTTP-only cookies
    if (data.success && data.data.tokens) {
      const cookieStore = await cookies();

      // Set access token cookie (1 hour)
      cookieStore.set("access_token", data.data.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });

      // Set refresh token cookie (7 days)
      cookieStore.set("refresh_token", data.data.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Login error:", error);

    const statusCode = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Login failed. Please try again.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}
