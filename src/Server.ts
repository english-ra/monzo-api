import express, { Application } from "express";
import AuthController from "./controllers/AuthController.js";
import { initScheduler } from "./scheduler/index.js";

export default class Server {
    public app: Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initialiseMiddlewares();
        this.initialiseRoutes();
    }

    private initialiseMiddlewares() {
        this.app.use(express.json());
    }

    private initialiseRoutes() {
        const callbackController = new AuthController();

        this.app.get("/auth/callback", callbackController.authCallback);
    }

    public async run() {
        try {
            // Start the server
            initScheduler();
            this.app.listen(this.port, () => {
                console.log(`Server is running on port: ${this.port}`);
            });
        } catch (error) {
            console.error("Error during data source initialisation:", error);
            process.exit(1);
        }
    }
}
