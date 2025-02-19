import cron from "node-cron";
import config from "../config/index.js";

export const initTaskRunner = () => {
    cron.schedule(config.cron.schedule, async () => {});
};
