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