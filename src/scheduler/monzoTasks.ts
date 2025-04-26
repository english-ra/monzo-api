import { MonzoService } from "../services/MonzoService.js";
import { ConfigUtil } from "../utils/configUtil.js";

const config = new ConfigUtil("/app/config/config.json");
const monzoService = new MonzoService();

export const processScheduledPotTransfers = async () => {
    await config.load();
    
    const tasks = JSON.parse(config.get("monzoTasks") as string);

    for (let [taskIndex, task] of tasks.entries()) {
        try {
            console.log(`Moving amount ${tasks.amount} to pot ${task.depositPot}`);
            const response = await monzoService.depositIntoPot("acc_00009kNwKfpQPAnBTrO62z", task.depositPot, task.amount);
            console.log(response);
        } catch (error) {
            console.log("Failed to deposit", error);
        }
    }
};
