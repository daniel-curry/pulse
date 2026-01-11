import { handleLogin} from "./auth/login";

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

    if (url.pathname === "/api/auth/login" || url.pathname === "/api/auth/login/") {
      return handleLogin(env);
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
