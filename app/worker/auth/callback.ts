export function handleCallback() {
    return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
    });
}