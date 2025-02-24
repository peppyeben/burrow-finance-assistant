import axios from "axios";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

export const getAssetFarms = async () => {
    try {
        const agent = new https.Agent({
            family: 4, // Force IPv4
            rejectUnauthorized: true,
        });

        const res = await axios.get(
            `${
                process.env.NEXT_PUBLIC_BURROW_FINANCE_API_ENDPOINT as string
            }/get_asset_farms_paged`,
            {
                timeout: 30000,
                httpsAgent: agent,
            }
        );

        if (res.data.code != 0) {
            throw res;
        }

        const assets = res.data.data.filter(
            (data: any) => Object.keys(data[1].rewards).length > 0
        );

        return assets;
    } catch (error) {
        throw error;
    }
};
