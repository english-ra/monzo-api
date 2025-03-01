import { Interface } from "readline";
import { askQuestion } from "./cli.js";
import cron from "node-cron";

export const executeCronCommand = async (command: string[], rl: Interface) => {
    switch (command[0]) {
        case "schedules":
            console.log(cron.getTasks());
            break;
        default:
            console.log(`Unknown command: ${command}`);
    };
};