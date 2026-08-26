import { NextResponse } from "next/server";
import { getCatalogue } from "@/lib/catalogue";

export async function GET() {
  return NextResponse.json({ products: getCatalogue() });
}