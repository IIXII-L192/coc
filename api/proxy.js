// Vercel Serverless Function — Proxy for Clash of Clans API
// Keeps your API key secure inside Vercel environment variables.

const COCApiBase = "https://api.clashofclans.com/v1";

export default async function handler(req, res) {
  const token = process.env.VERCEL_COC_API_TOKEN || process.env.COC_API_TOKEN;

  if (!token) {
    res.status(500).json({
      error: "Missing COC API Token in Vercel environment variables."
    });
    return;
  }

  const { path, method = "GET" } = req.query;

  if (!path) {
    return res.status(400).json({
      error: "Missing ?path= query. Example: /players/%23TAG"
    });
  }

  try {
    const safePath = path.startsWith("/") ? path : "/" + path;
    const url = COCApiBase + safePath;

    const fetchResp = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const text = await fetchResp.text();
    res.status(fetchResp.status).setHeader("Content-Type", "application/json");
    res.send(text);
  } catch (err) {
    res.status(502).json({
      error: "Upstream request failed",
      message: err.message
    });
  }
}
