import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/libs/axios-server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Forward logout request to backend
    await axiosServer.post("api/auth/logout");

    // Clear cookies
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Logout error:", error);

    // Even if backend fails, clear cookies
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 },
    );
  }
}
