const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export async function generatePKCE(): Promise<{
    codeVerifier: string;
    codeChallenge: string;
    state: string;
}> {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = base64encode(await sha256(codeVerifier));
    const state = generateRandomString(16);
    return { codeVerifier, codeChallenge, state };
}

export function buildSetCookie(
    name: string,
    value: string,
    options: {
        maxAgeSeconds: number, secure: boolean
    }) {
    const parts = [
        `${name}=${encodeURIComponent(value)}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        `Max-Age=${options.maxAgeSeconds}`,
    ];
    if (options.secure) parts.push("Secure");
    return parts.join("; ");
}