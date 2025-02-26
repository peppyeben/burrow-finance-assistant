import { NextResponse } from "next/server";
import { withdrawAsset } from ".";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");
        const amount = parseFloat(searchParams.get("amount") || "0");

        if (!token || amount <= 0) {
            return NextResponse.json(
                { error: "token and amount are required parameters" },
                { status: 400 }
            );
        }

        const preTX = await withdrawAsset(token, amount);

        const transactionPayload = {
            receiverId: preTX.data.contract_id,
            actions: [
                {
                    type: "FunctionCall",
                    params: {
                        methodName: preTX.data.method_name,
                        args: preTX.data.args,
                        gas: 300000000000000,
                        deposit: 0,
                    },
                },
            ],
        };

        return NextResponse.json({ transactionPayload });
    } catch (error) {
        console.error("Error generating NEAR transaction payload:", error);
        return NextResponse.json(
            { error: "Failed to generate NEAR transaction payload" },
            { status: 500 }
        );
    }
}
