import { Interface } from "readline";
import env from "../config/env.js";
import crypto from "crypto";
import config from "../config/index.js";
import { askQuestion } from "./cli.js";
import { ConfigUtil } from "../utils/configUtil.js";
import { MonzoService } from "../services/MonzoService.js";
import { executeMonzoCommand } from "./monzoCommands.js";

const configFile = new ConfigUtil("/app/config/config.json");

export const executeCommand = async (command: string, rl: Interface) => {
    const commands = command.split(" ");
    if (commands[0] === "monzo") {
        executeMonzoCommand(commands.slice(1), rl);
        return;
    }

    switch (command) {
        case "auth":
            initiateMonzoAuthentication(rl);
            break;
        case "auth creds":
            await setCredentials(rl);
            break;
        case "auth complete":
            await completeAuth();
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

const completeAuth = async () => {
    const monzoService = new MonzoService();
    try {
        console.log("Testing the connection to Monzo. Please bare with...");
        const response = await monzoService.getWhoAmI();
        console.log("Success!", response);
    } catch (error) {
        console.log(`Test failed: ${error}`);
    }
}