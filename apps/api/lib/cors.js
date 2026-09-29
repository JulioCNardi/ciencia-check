const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data, status = 200) {
  return Response.json(data, { status, headers: CORS_HEADERS });
}

function options() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

module.exports = { CORS_HEADERS, json, options };
