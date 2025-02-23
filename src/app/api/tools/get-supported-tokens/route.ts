import { NextResponse } from "next/server";
import { getSupportedBurrowTokens } from ".";

export async function GET() {
    const supportedBurrowTokens = await getSupportedBurrowTokens();

    return NextResponse.json({ supportedBurrowTokens });
}
