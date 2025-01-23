import { Interface } from "readline";
import env from "../config/env.js";
import crypto from "crypto";
import config from "../config/index.js";

export const executeCommand = async (command: string, rl: Interface) => {
    switch (command) {
        case "auth":
            console.log("Starting authentication...");
            initiateMonzoAuthentication();
            break;
        case "exit":
            rl.close();
            break;
        default:
            console.log(`Unknown command: ${command}`);
    };
};

function initiateMonzoAuthentication() {
    const stateToken = crypto.randomBytes(32).toString("hex");

    const authUrl = `${config.monzo.authRootUrl}/?${new URLSearchParams({
        client_id: env.monzo.clientId!,
        redirect_uri: "http://localhost:3000/auth/callback",
        response_type: "code",
        state: stateToken
    }).toString()}`;

    console.log(`Navigate here to continue: ${authUrl}`);
};