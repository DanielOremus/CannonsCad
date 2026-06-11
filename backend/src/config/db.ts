import "dotenv/config"

const config = Object.freeze({
  url: process.env.DATABASE_URL,
})

export { config as dbConfig }
