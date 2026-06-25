const config = {
  url: process.env.DATABASE_URL,
} as const

export { config as dbConfig }
