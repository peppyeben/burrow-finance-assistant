import { NextResponse } from "next/server";
import { getHealthFactor } from ".";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const accountID = searchParams.get("accountID");

        if (!accountID) {
            return NextResponse.json(
                { error: "your near account has to be connected" },
                { status: 400 }
            );
        }

        const healthFactor = await getHealthFactor(accountID);

        return NextResponse.json({ healthFactor });
    } catch (error) {
        throw error;
    }
}
