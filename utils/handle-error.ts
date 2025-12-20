import axios from "axios";
import { NextResponse } from "next/server";

export function handleError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return NextResponse.json(
      { error: error.response?.data || "Internal Server Error" },
      { status: error.response?.status || 500 },
    );
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
