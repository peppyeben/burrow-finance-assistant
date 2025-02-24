import axios from "axios";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

export const repayLoan = async (
    token: string,
    amount: number,
    from_supply: boolean
) => {
    try {
        const agent = new https.Agent({
            family: 4, // Force IPv4
            rejectUnauthorized: true,
        });

        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BURROW_FINANCE_API_ENDPOINT as string}/${
                from_supply == true
                    ? "repay_from_supplied"
                    : "repay_from_wallet"
            }`,
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
