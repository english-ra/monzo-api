import * as dotenv from "dotenv";

dotenv.config();

export default {
    nodeEnv: process.env.NODE_ENV,
    monzo: {
        accessToken: process.env.MONZO_ACCESS_TOKEN || "",
        accounts: {
            personal: {
                id: process.env.MONZO_ACCOUNTS_PERSONAL_ID
            },
            joint: {
                id: process.env.MONZO_ACCOUNTS_JOINT_ID,
                pots: {
                    rent: process.env.MONZO_ACCOUNTS_JOINT_POTS_RENT
                }
            }
        }
    }
};
