export async function handleCallback(request: Request, env: Env) {
    const url = new URL(request.url);

    // Extract code and state from URL query parameters
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

    // Step 3: Validate state matches (CSRF protection)
    // TODO: Add validation after Step 1 is complete

    // Step 4: Exchange code for tokens
    // TODO: We'll implement this together after the basics work

    // Step 5: Store tokens and redirect
    // TODO: Final step

    // Temporary: Return what we have for debugging
    return new Response(JSON.stringify({
        code: code,
        state: state,
        storedState,
        codeVerifier,
    }, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}