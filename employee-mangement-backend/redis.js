const { createClient } = require("redis");

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on("error", (err) => console.error("❌ Redis Error:", err));

// connect once
(async () => {
  await client.connect();
  console.log("✅ Connected to Redis");
})();

// Export wrapper functions (no promisify needed)
const getAsync = (key) => client.get(key);
const setAsync = (key, value) => client.set(key, value);
const setExAsync = (key, ttl, value) => client.setEx(key, ttl, value);
const delAsync = (key) => client.del(key);

module.exports = { client, getAsync, setAsync, setExAsync, delAsync };
