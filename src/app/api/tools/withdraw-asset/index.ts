import axios from "axios";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

export const withdrawAsset = async (token: string, amount: number) => {
    try {
        const agent = new https.Agent({
            family: 4, // Force IPv4
            rejectUnauthorized: true,
        });

        const res = await axios.post(
            `${
                process.env.NEXT_PUBLIC_BURROW_FINANCE_API_ENDPOINT as string
            }/withdraw`,
            {
                token_id: token,
                amount: amount,
            },
            {
                timeout: 30000,
                httpsAgent: agent,
            }
        );

        if (res.data.code != 0) {
            throw res;
        }

        return res.data;
    } catch (error) {
        throw error;
    }
};
