import { Router } from "express"
import userRoutes from "./users.js"
import authRoutes from "./auth.js"

const router = Router()

router.use("/users", userRoutes)
router.use("/auth", authRoutes)

router.use("/", function (req, res, next) {
  res.render("index", { title: "Express" })
})

export default router
