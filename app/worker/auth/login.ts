import { codeChallenge } from '../spotify/PKCE'

export interface Env {
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_REDIRECT_URI: string;
}

export function handleLogin(env: Env) {

    const clientId = env.SPOTIFY_CLIENT_ID;
    const redirectUri = env.SPOTIFY_REDIRECT_URI;
    const scopes = "user-read-private user-read-email";

    const spotifyAuthUrl =
        `https://accounts.spotify.com/authorize` +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scopes)}`;

    return Response.redirect(spotifyAuthUrl, 302);
}
