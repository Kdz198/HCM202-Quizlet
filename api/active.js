import { createClient } from 'redis';

let client = null;

async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || process.env.KV_URL
    });
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { sessionId } = req.query;

  if (!process.env.REDIS_URL && !process.env.KV_URL) {
    return res.status(200).json({
      activeUsers: 1,
      error: "REDIS_URL or KV_URL environment variable is missing."
    });
  }

  try {
    const redis = await getRedisClient();

    // 1. Register active user with TTL of 45 seconds
    if (sessionId) {
      const cleanSessionId = encodeURIComponent(sessionId);
      await redis.set(`hcm_active_${cleanSessionId}`, "1", {
        EX: 45
      });
    }

    // 2. Count active keys
    const keys = await redis.keys("hcm_active_*");
    const activeCount = Array.isArray(keys) ? keys.length : 1;

    return res.status(200).json({
      activeUsers: Math.max(1, activeCount)
    });
  } catch (error) {
    console.error("Error updating active users:", error);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      message: error.message,
      stack: error.stack,
      activeUsers: 1 
    });
  }
}
