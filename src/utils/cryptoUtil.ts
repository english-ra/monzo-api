import crypto from "crypto";

const algorithm = "aes-256-gcm";

export const encrypt = (text: string): string => {
    const secret = process.env.ENCRYPTION_KEY!;

    const salt = crypto.randomBytes(16);
    const key = crypto.scryptSync(secret, salt, 32);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return JSON.stringify({
        salt: salt.toString("hex"),
        iv: iv.toString("hex"),
        tag: tag.toString("hex"),
        content: encrypted.toString("hex"),
    });
};

export const decrypt = (encryptedText: string): string => {
    const secret = process.env.ENCRYPTION_KEY!;
    const { salt, iv, tag, content } = JSON.parse(encryptedText);

    const key = crypto.scryptSync(secret, Buffer.from(salt, "hex"), 32);

    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(tag, "hex"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(content, "hex")),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
};
