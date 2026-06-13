export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { sessionId } = req.query;

  let kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  let kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // Try to parse from REDIS_URL or KV_URL if REST variables are not provided
  if (!kvUrl || !kvToken) {
    const redisUrl = process.env.REDIS_URL || process.env.KV_URL;
    if (redisUrl) {
      try {
        const parsed = new URL(redisUrl);
        const host = parsed.hostname;
        const password = parsed.password || parsed.username;
        if (host && password) {
          kvUrl = `https://${host}`;
          kvToken = password;
        }
      } catch (e) {
        console.error("Failed to parse REDIS_URL:", e);
      }
    }
  }

  // If no KV credentials, return a mock or offline status
  if (!kvUrl || !kvToken) {
    const envKeys = Object.keys(process.env).filter(k => k.includes("REDIS") || k.includes("KV"));
    return res.status(200).json({
      activeUsers: 1,
      error: "Vercel KV or Upstash is not connected. Please connect Vercel KV or Upstash in your project storage settings.",
      detectedKeys: envKeys
    });
  }

  const headers = {
    Authorization: `Bearer ${kvToken}`
  };

  try {
    // 1. If sessionId is provided, register/refresh the user active state (TTL 45 seconds)
    if (sessionId) {
      const cleanSessionId = encodeURIComponent(sessionId);
      await fetch(
        `${kvUrl}/set/hcm_active_${cleanSessionId}/1/EX/45`,
        { headers }
      );
    }

    // 2. Retrieve all active user keys
    const keysResponse = await fetch(
      `${kvUrl}/keys/hcm_active_*`,
      { headers }
    );
    const keysData = await keysResponse.json();

    const activeCount = Array.isArray(keysData.result) ? keysData.result.length : 1;

    return res.status(200).json({
      activeUsers: Math.max(1, activeCount)
    });
  } catch (error) {
    console.error("Error updating active users:", error);
    return res.status(500).json({ error: "Internal Server Error", activeUsers: 1 });
  }
}
