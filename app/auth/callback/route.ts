// app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // aquí podries llegir el token, però per ara només el portem al login
  return NextResponse.redirect(new URL("/login", req.url));
}
