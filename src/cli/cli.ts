import readline from "readline";
import { executeCommand } from "./commands.js";

export const startCLI = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("CLI is ready. Type a command (e.g. 'auth')");

    rl.on("line", async (input) => {
        const command = input.trim();
        await executeCommand(command, rl);
        rl.prompt();
    });

    rl.on("close", () => {
        console.log("CLI closed.");
        process.exit(0);
    });

    rl.prompt();
};
