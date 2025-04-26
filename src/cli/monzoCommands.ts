import { Interface } from "readline";
import { askQuestion } from "./cli.js";
import { ConfigUtil } from "../utils/configUtil.js";
import { MonzoService } from "../services/MonzoService.js";
import { addSecondsToDate } from "../utils/utils.js";
import { processScheduledPotTransfers } from "../scheduler/monzoTasks.js";

const config = new ConfigUtil("/app/config/config.json");
const monzoService = new MonzoService();

export const executeMonzoCommand = async (command: string[], rl: Interface) => {
    switch (command[0]) {
        case "accounts":
            await displayAccounts();
            break;
        case "pots":
            await displayPots(command[1]);
            break;
        case "deposittest":
            await depositIntoPotTest();
            break;
        case "refresh":
            await refreshToken();
            break;
        case "set-tasks":
            await setDepositTasks(rl);
            break;
        case "run":
            await processScheduledPotTransfers();
            break;
        default:
            console.log(`Unknown command: ${command}`);
    };
};

export const refreshToken = async () => {
    try {
        await config.load();

        const refreshToken = config.getDecrypted('refreshToken');
        const clientId = config.getDecrypted('clientId');
        const clientSecret = config.getDecrypted('clientSecret');

        const refreshTokenData = await monzoService.getRefreshedToken(clientId!, clientSecret!, refreshToken!);

        config.setEncrypted("accessToken", refreshTokenData.access_token);
        config.setEncrypted("refreshToken", refreshTokenData.refresh_token);
        config.set("tokenExpires", addSecondsToDate(refreshTokenData.expires_in).toISOString());
        await config.save();
        console.log("Refresh successful");
    } catch (error) {
        console.log(`Error refreshing token: ${error}`);
    }
}

const displayAccounts = async () => {
    try {
        console.log("Loading accounts...");
        const response = await monzoService.getAccounts();
        console.table(response.accounts.map((account: any) => {
            return {
                "ID": account.id,
                "Name": account.description,
                "Type": account.type
            }
        }));
    } catch (error) {
        console.log(`Failed to get accounts: ${error}`);
    }
}

const displayPots = async (accountId: string) => {
    try {
        console.log("Loading pots...");
        const response = await monzoService.getPots(accountId);
        console.table(response.map((pot: any) => {
            return {
                "ID": pot.id,
                "Name": pot.name
            }
        }));
    } catch (error) {
        console.log(`Failed to get pots: ${error}`);
    }
};

const depositIntoPotTest = async () => {
    try {
        console.log("Testing deposit of 1p...");
        const response = await monzoService.depositIntoPot("acc_00009kNwKfpQPAnBTrO62z", "pot_0000AmQAy9k3s1XNiDsUF8", "1");
        console.log(response);
    } catch (error) {
        console.log("Failed to deposit", error);
    }
};

const setDepositTasks = async (rl: Interface) => {
    console.log("Enter the prompts below to set the tasks. Enter 'complete' at anytime to stop");

    const tasks = [];
    while (true) {
        const depositPot = await askQuestion("Please enter the id of the pot you want to deposit into: ", rl);
        if (depositPot === "complete") { break; }
        const amount = await askQuestion("Amount as an integer (£10.50 -> 1050): : ", rl);
        if (amount === "complete") { break; }

        tasks.push({
            depositPot: depositPot,
            amount: amount
        });
    };

    await config.load();
    config.set("monzoTasks", JSON.stringify(tasks));
    await config.save();
};
