import express, { type Express } from "express"
import { globalErrorHandler, catchNotFound } from "./api/middlewares/errorHandler.js"

import mainRouter from "./api/routes/index.js"
import appSetup from "./initializers/app.setup.js"

const app: Express = express()

appSetup(app)

app.use("/", mainRouter)

app.use(catchNotFound)
app.use(globalErrorHandler)

export default app
