import cron from "node-cron";
import { processScheduledPotTransfers } from "./monzoTasks.js";

export const initScheduler = () => {
    cron.schedule("0 1 * * *", async () => {
        try {
            console.log("Processing scheduled Monzo pot transfers...");
            await processScheduledPotTransfers();
        } catch (error) {
            console.log("Failed to process Monzo pot transfers:", error);
        };
    });
};