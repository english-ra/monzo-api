import * as dotenv from "dotenv";

dotenv.config();

export default {
    nodeEnv: process.env.NODE_ENV,
    encryptionKey: process.env.ENCRYPTION_KEY
};
