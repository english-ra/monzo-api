import { promises as fs } from "fs";
import path from "path";
import { decrypt, encrypt } from "./cryptoUtil";

export interface ConfigData {
    [key: string]: any;
}

export class ConfigUtil {
    private filePath: string;
    private config: ConfigData;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.config = {};
    }

    async load(defaultConfig: ConfigData = {}): Promise<void> {
        try {
            await fs.mkdir(path.dirname(this.filePath), { recursive: true });

            try {
                await fs.access(this.filePath);
            } catch {
                this.config = defaultConfig;
                await this.save();
                return;
            }

            const fileContent = await fs.readFile(this.filePath, "utf-8");
            this.config = JSON.parse(fileContent);
        } catch (error) {
            console.log("Error loading config file:", error);
            throw error;
        }
    }

    get<T>(key: string, defaultValue?: T): T | undefined {
        return this.config[key] !== undefined ? this.config[key] : defaultValue;
    }

    set(key: string, value: any): void {
        this.config[key] = value;
    }

    setEncrypted(key: string, value: string): void {
        this.config[key] = encrypt(value);
    }

    getDecrypted(key: string, secret: string): string | undefined {
        const encryptedValue = this.config[key];
        if (!encryptedValue) return undefined;
        try {
            return decrypt(encryptedValue);
        } catch (err) {
            console.error("Failed to decrypt config value for key:", key, err);
            return undefined;
        }
    }

    async save(): Promise<void> {
        try {
            const data = JSON.stringify(this.config, null, 2);
            await fs.writeFile(this.filePath, data, "utf-8");
        } catch (error) {
            console.error("Error saving config file:", error);
            throw error;
        }
    }

    async update(newData: Partial<ConfigData>): Promise<void> {
        this.config = { ...this.config, ...newData };
        await this.save();
    }
}
