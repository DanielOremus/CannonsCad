const config = Object.freeze({
  port: process.env.PORT || "3000",
  env: process.env.ENV,
  tokens: {
    access: {
      get secret() {
        const secret = process.env.ACCESS_TOKEN_SECRET
        if (!secret || secret.trim().length === 0)
          throw new Error("No secret provided for access token")
        return secret
      },
      expire: process.env.ACCESS_TOKEN_EXPIRE || "15min",
    },
    refresh: {
      get secret() {
        const secret = process.env.REFRESH_TOKEN_SECRET
        if (!secret || secret.trim().length === 0)
          throw new Error("No secret provided for refresh token")
        return secret
      },
      expire: process.env.REFRESH_TOKEN_EXPIRE || "7d",
    },
  },
})

export { config as appConfig }
