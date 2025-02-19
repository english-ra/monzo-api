import { Interface } from "readline";
import env from "../config/env.js";
import crypto from "crypto";
import config from "../config/index.js";
import { askQuestion } from "./cli.js";
import { ConfigUtil } from "../utils/configUtil.js";

const configFile = new ConfigUtil("/app/config/config.json");

export const executeCommand = async (command: string, rl: Interface) => {
    switch (command) {
        case "auth creds":
            await setCredentials(rl);
            break;
        case "auth":
            initiateMonzoAuthentication(rl);
            break;
        case "exit":
            rl.close();
            break;
        default:
            console.log(`Unknown command: ${command}`);
    };
};

const setCredentials = async (rl: Interface) => {
    const clientId = await askQuestion("Client ID:", rl);
    const clientSecret = await askQuestion("Client Secret:", rl);

    // Save to the config file
    try {
        await configFile.load();
        configFile.setEncrypted("clientId", clientId);
        configFile.setEncrypted("clientSecret", clientSecret);
        await configFile.save();

        console.log("Saved successfully - please type 'auth' to continue");
    } catch (error) {
        console.log("Failed to save credentials:", error);
    }
}

const initiateMonzoAuthentication = async (rl: Interface) => {

    // Ensure creds are set
    let clientId;
    let clientSecret;
    try {
        await configFile.load();
        clientId = configFile.getDecrypted('clientId');
        clientSecret = configFile.getDecrypted('clientSecret');

        if (!clientId || !clientSecret) {
            throw new Error("No credentials set, please set by typing 'auth creds'");
        }
    } catch (error) {
        console.log("Failed to initiate auth:", error);
        return;
    }

    const stateToken = crypto.randomBytes(32).toString("hex");

    const authUrl = `${config.monzo.authRootUrl}/?${new URLSearchParams({
        client_id: clientId!,
        redirect_uri: "http://localhost:3000/auth/callback",
        response_type: "code",
        state: stateToken
    }).toString()}`;

    console.log(`Navigate here to continue: ${authUrl}`);
    console.log("\nOnce completed, please type 'auth complete':");
};
