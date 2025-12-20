import { type NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/handle-error";
import { redirect } from "next/navigation";
import axiosServer from "@/libs/axios-server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!token_hash || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 },
      );
    }

    const body = { tokenHash: token_hash, type };

    const response = await axiosServer.post("api/auth/confirm", body);
    const data = response.data;

    // Store tokens in HTTP-only cookies if session is returned
    if (data.success && data.data.session) {
      const cookieStore = await cookies();

      cookieStore.set("access_token", data.data.session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });

      cookieStore.set("refresh_token", data.data.session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    return NextResponse.json(
      { message: "Email confirmed successfully" },
      { status: 200 },
    );
  } catch (error) {
    handleError(error);
    redirect("/auth/auth-code-error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token_hash, type } = body;

    if (!token_hash || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 },
      );
    }

    const response = await axiosServer.post("/auth/confirm", {
      tokenHash: token_hash,
      type,
    });
    const data = response.data;

    // Store tokens in HTTP-only cookies if session is returned
    if (data.success && data.data.session) {
      const cookieStore = await cookies();

      cookieStore.set("access_token", data.data.session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      });

      cookieStore.set("refresh_token", data.data.session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Email confirmation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Email confirmation failed",
      },
      { status: error.response?.status || 500 },
    );
  }
}
