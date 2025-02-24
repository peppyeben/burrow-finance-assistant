import axios from "axios";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

export const getHealthFactor = async (account: string) => {
    try {
        const agent = new https.Agent({
            family: 4, // Force IPv4
            rejectUnauthorized: true,
        });

        const res = await axios.get(
            `${
                process.env.NEXT_PUBLIC_BURROW_FINANCE_API_ENDPOINT as string
            }/health_factor/${account}`,
            {
                timeout: 30000,
                httpsAgent: agent,
            }
        );

        if (res.data.code != 0) {
            throw res;
        }

        const healthFactor = res.data.data;

        return healthFactor;
    } catch (error) {
        throw error;
    }
};
