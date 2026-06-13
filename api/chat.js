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

function sanitize(string) {
  if (typeof string !== 'string') return '';
  return string
    .trim()
    .slice(0, 500) // limit message length
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (!process.env.REDIS_URL && !process.env.KV_URL) {
    return res.status(200).json({
      messages: [],
      error: "Redis is not connected."
    });
  }

  try {
    const redis = await getRedisClient();

    if (req.method === "POST") {
      const { name, message } = req.body || {};
      const cleanName = sanitize(name).slice(0, 30); // limit name length
      const cleanMsg = sanitize(message);

      if (!cleanName || !cleanMsg) {
        return res.status(400).json({ error: "Name and message are required" });
      }

      const messageObj = {
        id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
        sender: cleanName,
        text: cleanMsg,
        timestamp: Date.now()
      };

      // Push to tail and trim to last 100 messages
      await redis.rPush("hcm_chat_messages", JSON.stringify(messageObj));
      await redis.lTrim("hcm_chat_messages", -100, -1);

      return res.status(200).json({ success: true, message: messageObj });
    } else {
      // GET method: retrieve messages
      const rawMsgs = await redis.lRange("hcm_chat_messages", 0, -1);
      const messages = rawMsgs.map(item => {
        try {
          return JSON.parse(item);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      return res.status(200).json({ messages });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Internal Server Error", messages: [] });
  }
}
