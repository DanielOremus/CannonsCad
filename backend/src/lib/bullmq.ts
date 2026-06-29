import { Job, Queue, Worker, createNodeRedisClient } from "bullmq"
import { redisClient } from "./redis.js"

const connection = createNodeRedisClient(redisClient)

const emailQueue = new Queue("email", { connection })
const emailWorker = new Worker(emailQueue.name, async (job: Job) => {}, {
  connection,
  autorun: false,
})

export { emailQueue }

export function startWorkers() {
  emailWorker.run()
}
