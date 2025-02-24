/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

export const getSupportedBurrowTokens = async () => {
    try {
        const agent = new https.Agent({
            family: 4, // Force IPv4
            rejectUnauthorized: true,
        });

        const res = await axios.get(
            `${
                process.env.NEXT_PUBLIC_BURROW_FINANCE_API_ENDPOINT as string
            }/list_token_data`,
            {
                timeout: 30000,
                httpsAgent: agent,
            }
        );

        if (res.data.code != 0) {
            throw res;
        }

        const tokens = res.data.data.map((data: any) => ({
            symbol: data.symbol,
            borrow_apy: data.borrow_apy,
            token_id: data.token,
            supply_apy: data.supply_apy,
        }));

        return tokens;
    } catch (error) {
        throw error;
    }
};
