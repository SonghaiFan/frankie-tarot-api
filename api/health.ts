export function fetch() {
  return Response.json({ status: "ok", service: "frankie-tarot-api", apiVersion: "1" }, {
    headers: { "Access-Control-Allow-Origin": "*", "X-Content-Type-Options": "nosniff" },
  });
}
