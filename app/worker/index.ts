export interface Env {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_REDIRECT_URI: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/health")) {
      return new Response(JSON.stringify({ ok: true, time: Date.now() }), {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    if (url.pathname === "/api/auth/login") {
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


    if (url.pathname === "/api/auth/callback" || url.pathname === "/api/auth/callback/") {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    return new Response(null, { status: 404 });
  },
};
