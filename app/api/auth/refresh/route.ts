import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      // Try to get from cookie
      const cookieStore = await cookies();
      const cookieRefreshToken = cookieStore.get("refresh_token")?.value;

      if (!cookieRefreshToken) {
        return NextResponse.json(
          {
            success: false,
            message: "Refresh token is required",
          },
          { status: 400 },
        );
      }

      // Use cookie token
      body.refreshToken = cookieRefreshToken;
    }

    // Forward request to backend
    const response = await axiosServer.post("api/auth/refresh", body);
    const data = response.data;

    // Update tokens in HTTP-only cookies
    if (data.success && data.data) {
      const cookieStore = await cookies();

      // Set new access token
      cookieStore.set("access_token", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });

      // Set new refresh token if provided
      if (data.data.refreshToken) {
        cookieStore.set("refresh_token", data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
      }
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Token refresh error:", error);

    // Clear cookies on refresh failure
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    const statusCode = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Token refresh failed";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}
