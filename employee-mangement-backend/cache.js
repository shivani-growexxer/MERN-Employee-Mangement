const redis = require("redis");
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

client.on("connect",()=>{
    console.log("Connected to Redis");
});

client.on("error",(err)=>{ console.log(err); });

module.exports = client;