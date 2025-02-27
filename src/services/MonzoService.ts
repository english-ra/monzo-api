import env from "../config/env.js";
import constants from "../config/index.js";
import { ConfigUtil } from "../utils/configUtil.js";

export class MonzoService {
    private config: ConfigUtil;

    constructor() {
        this.config = new ConfigUtil("/app/config/config.json");
    }

    public async getTokensFromCode(clientId: string, clientSecret: string, redirectUrl: string, code: string) {
        try {
            const formData = new URLSearchParams({
                grant_type: "authorization_code",
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUrl,
                code: code
            });
            const response = await fetch(`https://api.monzo.com/oauth2/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log("Error requesting auth:", error);
        }
    };

    public async getWhoAmI() {
        try {
            // Get the access token
            await this.config.load();
            const accessToken = this.config.getDecrypted('accessToken');

            console.log

            const response = await fetch(`${constants.monzo.apiRootUrl}/ping/whoami`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log("Error getting WhoAmI:", error);
        }
    }

    public async getAccounts() {
        try {
            // Get the access token
            await this.config.load();
            const accessToken = this.config.getDecrypted('accessToken');

            const response = await fetch(`${constants.monzo.apiRootUrl}/accounts`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log("Error getting accounts:", error);
        }
    }

    public async getPots(accountId: string) {
        try {
            // Get the access token
            await this.config.load();
            const accessToken = this.config.getDecrypted('accessToken');

            const searchParams = new URLSearchParams({ current_account_id: accountId, deleted: 'false' }).toString();
            const response = await fetch(`${constants.monzo.apiRootUrl}/pots?${searchParams}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data.pots.filter((pot: any) => pot.deleted == false);
        } catch (error) {
            console.log("Error getting pots:", error);
        }
    }
}
