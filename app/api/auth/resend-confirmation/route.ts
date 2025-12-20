import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 },
      );
    }

    // Forward request to backend
    const response = await axiosServer.post("/auth/resend-confirmation", {
      email,
    });
    const data = response.data;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Resend confirmation error:", error);

    const statusCode = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to resend confirmation email";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}
