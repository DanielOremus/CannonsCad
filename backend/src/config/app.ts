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
      get expire() {
        const v = parseInt(`${process.env.ACCESS_TOKEN_EXPIRE}`)
        return isFinite(v) ? Math.abs(v) : 60 * 15 //15m
      },
    },
    refresh: {
      get secret() {
        const secret = process.env.REFRESH_TOKEN_SECRET
        if (!secret || secret.trim().length === 0)
          throw new Error("No secret provided for refresh token")
        return secret
      },
      get expire() {
        const v = parseInt(`${process.env.REFRESH_TOKEN_EXPIRE}`)
        return isFinite(v) ? Math.abs(v) : 3600 * 24 * 7 //7d
      },
    },
  },
})

export { config as appConfig }
