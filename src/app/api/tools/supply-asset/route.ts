import { NextResponse } from "next/server";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { supplyAsset } from ".";

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

        console.log("Token: ", token);
        console.log("Amount: ", amount);

        const preTX = await supplyAsset(token, amount);

        console.log(preTX);
        console.log(preTX.data);

        const transactionPayload = {
            receiverId: preTX.data.contract_id,
            actions: [
                {
                    type: "FunctionCall",
                    params: {
                        methodName: preTX.data.method_name,
                        args: preTX.data.args,
                        gas: 150000000000000,
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
