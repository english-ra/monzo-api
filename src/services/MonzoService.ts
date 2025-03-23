import { randomUUID } from "crypto";
import env from "../config/env.js";
import constants from "../config/index.js";
import { ConfigUtil } from "../utils/configUtil.js";
import { addSecondsToDate } from "../utils/utils.js";

export class MonzoService {
    private config: ConfigUtil;

    constructor() {
        this.config = new ConfigUtil("/app/config/config.json");
    }

    async getAccessToken() {
        await this.config.load();

        const tokenExpiry = this.config.get('tokenExpires');

        if (new Date() > new Date(tokenExpiry as string)) {
            try {
                await this.config.load();
            
                const refreshToken = this.config.getDecrypted('refreshToken');
                const clientId = this.config.getDecrypted('clientId');
                const clientSecret = this.config.getDecrypted('clientSecret');
            
                const refreshTokenData = await this.getRefreshedToken(clientId!, clientSecret!, refreshToken!);
            
                this.config.setEncrypted("accessToken", refreshTokenData.access_token);
                this.config.setEncrypted("refreshToken", refreshTokenData.refresh_token);
                this.config.set("tokenExpires", addSecondsToDate(refreshTokenData.expires_in).toISOString());
                await this.config.save();
                console.log("Refresh successful");
            } catch (error) {
                console.log(`Error refreshing token: ${error}`);
            }
        }

        const accessToken = this.config.getDecrypted('accessToken');
        return accessToken;
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

    public async getRefreshedToken(clientId: string, clientSecret: string, refreshToken: string) {
        try {
            const formData = new URLSearchParams({
                grant_type: "refresh_token",
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken
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
            console.log("Error requesting refresh token:", error);
        }
    };

    public async getWhoAmI() {
        try {
            // Get the access token
            const accessToken = await this.getAccessToken();

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
            const accessToken = await this.getAccessToken();

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
            const accessToken = await this.getAccessToken();

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

    public async depositIntoPot(sourceAccountId: string, potId: string, amount: string) {
        try {
            // Get the access token
            const accessToken = await this.getAccessToken();

            const body = new URLSearchParams({
                source_account_id: sourceAccountId,
                amount: amount.toString(),
                dedupe_id: randomUUID().toString()
            }).toString();
            const response = await fetch(`${constants.monzo.apiRootUrl}/pots/${potId}/deposit`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: body
            });

            if (!response.ok) {
                const data = await response.json();
                console.log(data);
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log("Error depositing into a pot:", error);
        }
    }
}
