import { NextResponse } from "next/server";
import { getAssetFarms } from ".";

export async function GET() {
    const assetFarms = await getAssetFarms();

    return NextResponse.json({ assetFarms });
}
