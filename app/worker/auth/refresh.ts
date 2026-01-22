import { buildSetCookie } from "../spotify/PKCE";

export async function handleRefresh(request: Request, env: Env): Promise<Response> {
    const cookieHeader = request.headers.get("Cookie") || "";

    const cookies = Object.fromEntries(
        cookieHeader.split("; ").map(c => c.split("="))
    );

    const refreshToken = cookies["spotify-refresh-token"];

    if (!refreshToken) {
        return new Response("No refresh token found", { status: 401 });
    }

    const tokenRefreshBody = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: env.SPOTIFY_CLIENT_ID,
    });

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenRefreshBody,
    });

    if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        return new Response(`Token refresh failed: ${error}`, { status: 400 });
    }

    const tokens = await tokenResponse.json() as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    };

    const headers = new Headers();

    const accessCookie = buildSetCookie("spotify-access-token", tokens.access_token, {maxAgeSeconds: tokens.expires_in, secure: false});
    headers.append("Set-Cookie", accessCookie);

    if (tokens.refresh_token) {
        const refreshCookie = buildSetCookie("spotify-refresh-token", tokens.refresh_token, {maxAgeSeconds: 60 * 60 * 24 * 30, secure: false});
        headers.append("Set-Cookie", refreshCookie);
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers
    });
}