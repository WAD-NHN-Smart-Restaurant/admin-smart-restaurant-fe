import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password is required",
        },
        { status: 400 },
      );
    }

    // Forward request to backend (token is automatically added by interceptor)
    const response = await axiosServer.post("/auth/update-password", {
      newPassword,
    });
    const data = response.data;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Update password error:", error);

    const statusCode = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update password";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}
