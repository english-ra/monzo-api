import config from "../config/index.js";
import env from "../config/env.js";

export class MonzoService {

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

    public async getPots(accountId: string) {
        try {
            const searchParams = new URLSearchParams({ current_account_id: accountId }).toString();
            const response = await fetch(`${config.monzo.apiRootUrl}/pots?${searchParams}`, {
                method: "GET",
                headers: {
                    "Authorization": env.monzo.accessToken
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log("Error obtaining pot:", error);
        }
    };
}
