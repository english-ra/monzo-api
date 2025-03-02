import { Interface } from "readline";
import { askQuestion } from "./cli.js";
import { ConfigUtil } from "../utils/configUtil.js";
import { MonzoService } from "../services/MonzoService.js";

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
        default:
            console.log(`Unknown command: ${command}`);
    };
};

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
