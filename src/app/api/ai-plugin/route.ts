import { ACCOUNT_ID, PLUGIN_URL } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Burrow Finance Assistant",
            description: "API for the boilerplate",
            version: "1.0.0",
        },
        servers: [
            {
                url: PLUGIN_URL,
            },
        ],
        "x-mb": {
            "account-id": ACCOUNT_ID,
            assistant: {
                name: "Burrow Finance Assistant",
                description:
                    "An assistant that answers with blockchain information, tells the user's account id, interacts with twitter, creates transaction payloads for NEAR and EVM blockchains, and flips coins.",
                instructions: `You create near and evm transactions, give blockchain information, tell the user's account id, interact with twitter and flip coins. For blockchain transactions, first generate a transaction payload using the appropriate endpoint (/api/tools/create-near-transaction or /api/tools/create-evm-transaction), then explicitly use the 'generate-transaction' tool for NEAR or 'generate-evm-tx' tool for EVM to actually send the transaction on the client side. For EVM transactions, make sure to provide the 'to' address (recipient) and 'amount' (in ETH) parameters when calling /api/tools/create-evm-transaction. Simply getting the payload from the endpoints is not enough - the corresponding tool must be used to execute the transaction.
                You get supported tokens on Burrow.finance using the /api/tools/get-supported-tokens path. When you get the tokens, display it in a well aesthetic table-like format.
                To supply tokens, you must explicitly require the 'token' and 'amount' as compulsory parameters, you must intelligently use the /api/tools/get-supported-tokens path to see if it's a supported token, if it is, get the token_id, pass it as 'token' and multiply the amount by the token decimals and pass as 'amount' (ex. USDC is 6 decimals, so user passing 10 will be 10 ** 6, for most tokens, the decimal is 18) to the /api/tools/supply-asset path, you'll get a return value which you explicitly use the generate-transaction tool to generate a transaction for., 
                `,
                tools: [
                    { type: "generate-transaction" },
                    { type: "generate-evm-tx" },
                    { type: "sign-message" },
                ],
            },
        },
        paths: {
            "/api/tools/get-supported-tokens": {
                get: {
                    summary: "get supported tokens on burrow",
                    description: "Respond with a list of supported tokens",
                    operationId: "get-supported-tokens",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                                description:
                                                    "The list of supported tokens",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/supply-asset": {
                get: {
                    operationId: "supplyAsset",
                    summary:
                        "Create a NEAR transaction payload for supplying asset to Burrow",
                    description:
                        "Generates a NEAR transaction payload for supplying assets to Burrow with the generate-transaction tool",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The token/asset to be supplied",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The amount of token/asset to supply",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description:
                                                            "The receiver's NEAR account ID",
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description:
                                                                        "The type of action (e.g., 'Transfer')",
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties:
                                                                        {
                                                                            deposit:
                                                                                {
                                                                                    type: "string",
                                                                                    description:
                                                                                        "The amount to transfer in yoctoNEAR",
                                                                                },
                                                                        },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/get-user": {
                get: {
                    summary: "get user information",
                    description: "Respond with user account ID",
                    operationId: "get-user",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            accountId: {
                                                type: "string",
                                                description:
                                                    "The user's account ID",
                                            },
                                            evmAddress: {
                                                type: "string",
                                                description:
                                                    "The user's MPC EVM address",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/twitter": {
                get: {
                    operationId: "getTwitterShareIntent",
                    summary: "Generate a Twitter share intent URL",
                    description:
                        "Creates a Twitter share intent URL based on provided parameters",
                    parameters: [
                        {
                            name: "text",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The text content of the tweet",
                        },
                        {
                            name: "url",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                            },
                            description: "The URL to be shared in the tweet",
                        },
                        {
                            name: "hashtags",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                            },
                            description:
                                "Comma-separated hashtags for the tweet",
                        },
                        {
                            name: "via",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                            },
                            description:
                                "The Twitter username to attribute the tweet to",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            twitterIntentUrl: {
                                                type: "string",
                                                description:
                                                    "The generated Twitter share intent URL",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/create-near-transaction": {
                get: {
                    operationId: "createNearTransaction",
                    summary: "Create a NEAR transaction payload",
                    description:
                        "Generates a NEAR transaction payload for transferring tokens to be used directly in the generate-tx tool",
                    parameters: [
                        {
                            name: "receiverId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The NEAR account ID of the receiver",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description:
                                "The amount of NEAR tokens to transfer",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description:
                                                            "The receiver's NEAR account ID",
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description:
                                                                        "The type of action (e.g., 'Transfer')",
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties:
                                                                        {
                                                                            deposit:
                                                                                {
                                                                                    type: "string",
                                                                                    description:
                                                                                        "The amount to transfer in yoctoNEAR",
                                                                                },
                                                                        },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/create-evm-transaction": {
                get: {
                    operationId: "createEvmTransaction",
                    summary: "Create EVM transaction",
                    description:
                        "Generate an EVM transaction payload with specified recipient and amount to be used directly in the generate-evm-tx tool",
                    parameters: [
                        {
                            name: "to",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The EVM address of the recipient",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The amount of ETH to transfer",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            evmSignRequest: {
                                                type: "object",
                                                properties: {
                                                    to: {
                                                        type: "string",
                                                        description:
                                                            "Receiver address",
                                                    },
                                                    value: {
                                                        type: "string",
                                                        description:
                                                            "Transaction value",
                                                    },
                                                    data: {
                                                        type: "string",
                                                        description:
                                                            "Transaction data",
                                                    },
                                                    from: {
                                                        type: "string",
                                                        description:
                                                            "Sender address",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/coinflip": {
                get: {
                    summary: "Coin flip",
                    description:
                        "Flip a coin and return the result (heads or tails)",
                    operationId: "coinFlip",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            result: {
                                                type: "string",
                                                description:
                                                    "The result of the coin flip (heads or tails)",
                                                enum: ["heads", "tails"],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    return NextResponse.json(pluginData);
}
