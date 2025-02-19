import { startCLI } from "./cli/cli.js";
import Server from "./Server.js";

const port = Number(process.env.PORT) || 3000;

if (process.argv.includes("cli")) {
    startCLI();
} else {
    const server = new Server(port);
    server.run();
}
