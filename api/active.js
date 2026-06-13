export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { sessionId } = req.query;

  // If no KV credentials, return a mock or offline status
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(200).json({
      activeUsers: 1,
      error: "Vercel KV is not connected. Please connect Vercel KV in your project storage settings."
    });
  }

  const headers = {
    Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`
  };

  try {
    // 1. If sessionId is provided, register/refresh the user active state (TTL 45 seconds)
    if (sessionId) {
      const cleanSessionId = encodeURIComponent(sessionId);
      await fetch(
        `${process.env.KV_REST_API_URL}/set/hcm_active_${cleanSessionId}/1/EX/45`,
        { headers }
      );
    }

    // 2. Retrieve all active user keys
    const keysResponse = await fetch(
      `${process.env.KV_REST_API_URL}/keys/hcm_active_*`,
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
