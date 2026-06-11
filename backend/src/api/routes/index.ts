import { Router } from "express"
import userRouters from "./users.js"

const router = Router()

router.use("/users", userRouters)

router.use("/", function (req, res, next) {
  res.render("index", { title: "Express" })
})

export default router
