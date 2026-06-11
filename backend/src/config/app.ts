import "dotenv/config"

const config = Object.freeze({
  port: process.env.PORT || "3000",
  env: process.env.ENV,
})

export { config as appConfig }
