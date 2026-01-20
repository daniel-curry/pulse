import {generatePKCE, buildSetCookie} from "../spotify/PKCE";

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

    const { codeVerifier, codeChallenge, state } = await generatePKCE();

    const spotifyAuthUrl =
        `https://accounts.spotify.com/authorize` +
        `?client_id=${encodeURIComponent(CLIENT_ID)}` +
        `&response_type=code` +
        `&redirect_uri=${REDIRECT_URI}` +
        `&state=${encodeURIComponent(state)}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&code_challenge_method=S256` +
        `&code_challenge=${encodeURIComponent(codeChallenge)}`;


    // MAKE SURE TO SET secure BOOLEAN TO TRUE IN PROD!
    const stateCookie = buildSetCookie("spotify-state", state, {maxAgeSeconds: 600, secure: false});
    const verifierCookie = buildSetCookie("spotify-code-verifier", codeVerifier, {maxAgeSeconds: 600, secure: false});
    const headers = new Headers();
    headers.append("Set-Cookie", stateCookie);
    headers.append("Set-Cookie", verifierCookie);
    headers.set("Location", spotifyAuthUrl);

    return new Response(null, {status: 302, headers});
}
