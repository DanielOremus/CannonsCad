import { createClient } from "redis"
import { redisConfig } from "../config/redis.js"
import { Logger } from "../utils/logger.js"

const client = createClient(redisConfig)

client.on("error", (err) => Logger.error("Redis Client Error", err))

export async function connectRedis(): Promise<void> {
  await client.ping()
}

export { client as redisClient }
