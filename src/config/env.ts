import * as dotenv from "dotenv";

dotenv.config();

export default {
    nodeEnv: process.env.NODE_ENV,
    encryptionKey: process.env.ENCRYPTION_KEY,
    monzo: {
        clientId: process.env.MONZO_CLIENT_ID,
        clientSecret: process.env.MONZO_CLIENT_SECRET,
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
