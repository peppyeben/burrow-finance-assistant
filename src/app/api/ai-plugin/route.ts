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
                    "An assistant specialized in Burrow Finance, providing key functionalities such as supplying and borrowing assets, managing collateral. It can display the user's Burrow account details, including supplied assets, borrowed amounts, collateral status, and health factor. Additionally, it generates transaction payloads for supplying, borrowing, repaying, withdrawing on NEAR to help users stay informed about their positions.",
                instructions: `
                You get supported tokens on Burrow.finance using the /api/tools/get-supported-tokens path. When you get the tokens, display it in a well aesthetic table-like format.
                To supply tokens/assets, you must explicitly require the 'token' and 'amount' as compulsory parameters, you must intelligently use the /api/tools/get-supported-tokens path to see if it's a supported token, if it is, get the token_id, pass it as 'token' and multiply the amount by the token decimals and pass as 'amount' (ex. USDC is 6 decimals, so user passing 10 will be 10e6, for most tokens, the decimal is 18) to the /api/tools/supply-asset path, you'll get a return value which you explicitly use the generate-transaction tool to generate a transaction for.
                To borrow tokens/assets, you must explicitly require the 'token' and 'amount' as compulsory parameters, you must intelligently use the /api/tools/get-supported-tokens path to see if it's a supported token, if it is, get the token_id, pass it as 'token' and multiply the amount by the token decimals and pass as 'amount' (ex. USDC is 6 decimals, so user passing 10 will be 10e6, for most tokens, the decimal is 18) to the /api/tools/borrow-asset path, you'll get a return value which you explicitly use the generate-transaction tool to generate a transaction for.
                To withdraw tokens/assets, you must explicitly require the 'token' and 'amount' as compulsory parameters, you must intelligently use the /api/tools/get-supported-tokens path to see if it's a supported token, if it is, get the token_id, pass it as 'token' and multiply the amount by the token decimals and pass as 'amount' (ex. USDC is 6 decimals, so user passing 10 will be 10e6, for most tokens, the decimal is 18) to the /api/tools/withdraw-asset path, you'll get a return value which you explicitly use the generate-transaction tool to generate a transaction for.
                To repay loans, you must explicitly require the 'token' and 'amount' as compulsory parameters and where to repay from 'fromSupply' as an optional parameter (if not specified, 'fromSupply' will be false, if specified, it'll be true), you must intelligently use the /api/tools/get-supported-tokens path to see if it's a supported token, if it is, get the token_id, pass it as 'token' and multiply the amount by the token decimals and pass as 'amount' (ex. USDC is 6 decimals, so user passing 10 will be 10e6, for most tokens, the decimal is 18) to the /api/tools/repay-loan path, you'll get a return value which you explicitly use the generate-transaction tool to generate a transaction for.
                To increase collateral of tokens/assets, you must explicitly require the 'token' and 'amount' as compulsory parameters, you must intelligently use the /api/tools/get-supported-tokens path to see if it's a supported token, if it is, get the token_id, pass it as 'token' and multiply the amount by the token decimals and pass as 'amount' (ex. USDC is 6 decimals, so user passing 10 will be 10e6, for most tokens, the decimal is 18) to the /api/tools/increase-collateral path, you'll get a return value which you explicitly use the generate-transaction tool to generate a transaction for.
                To decrease collateral of tokens/assets, you must explicitly require the 'token' and 'amount' as compulsory parameters, you must intelligently use the /api/tools/get-supported-tokens path to see if it's a supported token, if it is, get the token_id, pass it as 'token' and multiply the amount by the token decimals and pass as 'amount' (ex. USDC is 6 decimals, so user passing 10 will be 10e6, for most tokens, the decimal is 18) to the /api/tools/decrease-collateral path, you'll get a return value which you explicitly use the generate-transaction tool to generate a transaction for.
                `,
                tools: [
                    { type: "generate-transaction" },
                    { type: "generate-evm-tx" },
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
            "/api/tools/borrow-asset": {
                get: {
                    operationId: "borrowAsset",
                    summary:
                        "Create a NEAR transaction payload for borrowing asset from Burrow",
                    description:
                        "Generates a NEAR transaction payload for borrowing assets from Burrow with the generate-transaction tool",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The token/asset to be borrowed",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The amount of token/asset to borrow",
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
            "/api/tools/withdraw-asset": {
                get: {
                    operationId: "withdrawAsset",
                    summary:
                        "Create a NEAR transaction payload for withdrawing asset from Burrow",
                    description:
                        "Generates a NEAR transaction payload for withdrawing assets from Burrow with the generate-transaction tool",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The token/asset to be withdrawn",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description:
                                "The amount of token/asset to withdrawn",
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
            "/api/tools/repay-loan": {
                get: {
                    operationId: "repayLoan",
                    summary:
                        "Create a NEAR transaction payload for repaying a borrowed loan from Burrow",
                    description:
                        "Generates a NEAR transaction payload for repaying borrowed loans from Burrow with the generate-transaction tool",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The token/asset to repay.",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The amount of token/asset to repay",
                        },
                        {
                            name: "fromSupply",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                            },
                            description: "Source of loan repayment",
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
            "/api/tools/increase-collateral": {
                get: {
                    operationId: "increaseCollateral",
                    summary:
                        "Create a NEAR transaction payload for increasing token/asset collateral on Burrow",
                    description:
                        "Generates a NEAR transaction payload for increasing token/asset collateral on Burrow with the generate-transaction tool",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description:
                                "The token/asset collateral to be increased.",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description:
                                "The amount of token/asset to increase by.",
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
            "/api/tools/decrease-collateral": {
                get: {
                    operationId: "decreaseCollateral",
                    summary:
                        "Create a NEAR transaction payload for decreasing token/asset collateral on Burrow",
                    description:
                        "Generates a NEAR transaction payload for decreasing token/asset collateral on Burrow with the generate-transaction tool",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description:
                                "The token/asset collateral to be decreased.",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description:
                                "The amount of token/asset to decrease by.",
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
        },
    };

    return NextResponse.json(pluginData);
}
