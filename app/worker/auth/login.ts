import { codeChallenge } from '../spotify/PKCE'

export interface Env {
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_REDIRECT_URI: string;
    SPOTIFY_SCOPES: string;
}

export function handleLogin(env: Env) {

    const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = env.SPOTIFY_REDIRECT_URI;
    const SPOTIFY_SCOPES = [
        "streaming",
        "user-read-email",
        "user-read-private",
        "user-modify-playback-state",
        "user-read-playback-state"
    ]

    const scopes = SPOTIFY_SCOPES.join(' ');

    const spotifyAuthUrl =
        `https://accounts.spotify.com/authorize` +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scopes)}`;

    return Response.redirect(spotifyAuthUrl, 302);
}
