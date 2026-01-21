import { buildSetCookie} from "../spotify/PKCE";

export async function handleCallback(request: Request, env: Env) {
    const url = new URL(request.url);

    const code = url.searchParams.get("code")
    const state = url.searchParams.get(("state"))

    // Step 2: Parse cookies from the request
    // Cookies come in the "Cookie" header as: "name1=value1; name2=value2"
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies = Object.fromEntries(
        cookieHeader.split("; ").map(c => c.split("="))
    );
    const storedState = cookies["spotify-state"];
    const codeVerifier = cookies["spotify-code-verifier"];

    // Validate state matches (CSRF protection)
    if (!state || !storedState || state !== storedState) {
        return new Response("State mismatch", { status: 400 });
    }

    if (!code) {
        return new Response("Missing code parameter", { status: 400 });
    }

    if (!codeVerifier) {
        return new Response("Missing code verifier", { status: 400 });
    }

    const tokenRequestBody = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: env.SPOTIFY_REDIRECT_URI,
        client_id: env.SPOTIFY_CLIENT_ID,
        code_verifier: codeVerifier,
    });

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenRequestBody,
    });

    if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        return new Response(`Token exchange failed: ${error}`, { status: 400 });
    }

    const tokens = await tokenResponse.json() as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    };

    const access_token = buildSetCookie("spotify-access-token", tokens.access_token, {maxAgeSeconds: tokens.expires_in, secure: false});
    // Refresh token valid for 30 days
    const refresh_token = buildSetCookie("spotify-refresh-token", tokens.refresh_token, {maxAgeSeconds: 60 * 60 * 24 * 30, secure: false});

    // Clear temporary cookies
    const clearStateCookie = buildSetCookie("spotify-state", "", {maxAgeSeconds: 0, secure: false});
    const clearVerifierCookie = buildSetCookie("spotify-code-verifier", "", {maxAgeSeconds: 0, secure: false});

    const headers = new Headers();
    headers.append("Set-Cookie", access_token);
    headers.append("Set-Cookie", refresh_token);
    headers.append("Set-Cookie", clearStateCookie);
    headers.append("Set-Cookie", clearVerifierCookie);
    headers.set("Location", "/");

    return new Response(null, { status: 302, headers });
}