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

    const nextResponse = NextResponse.json(
      { data: response.data },
      { status: 200 }
    );

    if (response.data.data.accessToken) {
      // Store tokens in HTTP-only cookies
      nextResponse.cookies.set("access_token", response.data.data.accessToken, {
        httpOnly: true,
        path: "/",
      });
    }

    return nextResponse;
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
