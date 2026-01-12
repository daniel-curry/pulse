import { codeChallenge } from '../spotify/PKCE'

export async function handleLogin(env: Env) {

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
        `?client_id=${encodeURIComponent(CLIENT_ID)}` +
        `&response_type=code` +
        `&redirect_uri=${REDIRECT_URI}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&code_challenge_method=S256` +
        `&code_challenge=${encodeURIComponent(codeChallenge)}`;

    return Response.redirect(spotifyAuthUrl, 302);
}
