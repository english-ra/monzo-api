import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { MonzoService } from "../services/MonzoService.js";
import { ConfigUtil } from "../utils/configUtil.js";

export default class AuthController {
    private config: ConfigUtil;
    private monzoService: MonzoService;

    constructor() {
        this.config = new ConfigUtil("/app/config/config.json");
        this.monzoService = new MonzoService();
    }

    public authCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const code = req.query.code as string;
        const state = req.query.state;

        let clientId;
        let clientSecret;
        try {
            await this.config.load();
            clientId = this.config.getDecrypted('clientId');
            clientSecret = this.config.getDecrypted('clientSecret');

            if (!clientId || !clientSecret) {
                throw new Error("No credentials set, please set credentials in the CLI");
            }
        } catch (error) {
            console.log("Failed to get code:", error);
        }

        try {
            const tokens = await this.monzoService.getTokensFromCode(clientId!, clientSecret!, "http://localhost:3000/auth/callback", code);

            const accessToken = tokens.access_token;
            const refreshToken = tokens.refresh_token;
            const userId = tokens.user_id;

            // Save to the config file
            try {
                await this.config.load();
                this.config.setEncrypted("accessToken", accessToken);
                this.config.setEncrypted("refreshToken", refreshToken);
                this.config.set("userId", userId);
                await this.config.save();
            } catch (error) {
                throw new Error("Failed to save tokens");
            }

            res.status(200).json({ "response": "Success" });
        } catch (error) {
            res.status(400).json({ "error": `Auth fail: ${error}` });
        }
    };
}
